const { EventEmitter } = require('events');


module.exports = class Music extends EventEmitter {
	constructor(client, id) {
		super();
		this.client = client;
		this.id = id;
		this._queue = [];
		this.loop = false;
		this.channelID = null;
		this.on('TrackEnd', this._handleEnd.bind(this));
		this.on('TrackStuck', this._stuck.bind(this));
	}

	queue(songinfo) {
		this._queue.push(songinfo);
		if (!this.playing) {
			return this._play();
		}
	}

	queueNext(songinfo) {
		this._queue.splice(1, 0, songinfo);
		if (!this.playing) {
			return this._play();
		}
	}

	skip(amount = 1) {
		const skipped = this._queue.splice(0, amount);
		this._stop();
		return skipped;
	}

	shuffle() {
		return this._shuffle(this._queue);
	}

	remove(index) {
		return this._queue.splice(index, 1);
	}

	clear() {
		this._queue.length = 1;
	}

	reset() {
		if (this._queue.length > 0) this._queue.length = 0;
		if (this.loop) this.loop = false;
		if (this.playing) this._stop();
	}

	_play(options) {
		const channel = this.client.channels.get(this.channelID);
		const embed = new this.client.methods.Embed()
			.setAuthor(this._queue[0].user.name, this._queue[0].user.url)
			.addField('Now Playing:', `[${this._queue[0].info.title}](${this._queue[0].info.uri})`)
			.setColor('RANDOM');
		if (channel) channel.send(embed);
		const { track } = this._queue[0];
		this.player.play(track, options);
	}

	_stop() {
		this.player.stop();
	}

	_handleEnd(event) {
		const shifted = this._queue.shift();
		if (event.reason === 'FINISHED') return this._finished(event, shifted);
		else if (event.reason === 'STOPPED') return this._stopped(event, shifted);
		else if (event.reason === 'FAILED') return this._failed(event);
	}

	_finished(event, shifted) {
		if (this.loop) this._queue.push(shifted);
		if (!this._queue.length) return;
		return this._play();
	}

	_failed() {
		const channel = this.client.channels.get(this.channelID);
		channel.send('Sorry seems like i encountered an issue while playing this song, so i skipped it');
		if (!this._queue.length) return;
		return this._play();
	}

	_stopped(event, shifted) {
		if (this.loop) this._queue.push(shifted);
		if (!this._queue.length) return;
		return this._play();
	}

	_stuck() {
		this._stop();
	}

	_shuffle(queue) {
		let firstSong = queue.shift();
		let currentIndex = queue.length,
			randomIndex,
			temporaryValue;

		// While there remain elements to shuffle...
		while (currentIndex !== 0) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = queue[currentIndex];
			queue[currentIndex] = queue[randomIndex];
			queue[randomIndex] = temporaryValue;
		}

		// Add first song again to queue
		queue.unshift(firstSong);

		// Return queue
		return queue;
	}

	get channel() {
		return this.client.channels.get(this.channelID);
	}

	get nowPlaying() {
		return this._queue[0];
	}

	get playing() {
		return this.player.playing;
	}

	get player() {
		return this.client.customPieceStore.get('Lavalink').lavalink.players.get(this.id);
	}
};
