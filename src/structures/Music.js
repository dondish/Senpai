const { EventEmitter } = require('events');


module.exports = class Music extends EventEmitter {
	constructor(client, id) {
		super();
		this.client = client;
		this.id = id;
		this.playing = false;
		this._queue = [];
		this.loop = false;
		this._channelID = null;
		this.on('TrackEnd', this._handleEnd.bind(this));
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

	stop() {
		this.client.lavalink.players.get(this.id).stop();
	}

	shuffle() {
		this._shuffle(this._queue);
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
		if (this.playing) this.stop();
	}

	_play(options) {
		const channel = this.client.channels.get(this.channelID);
		const embed = new this.client.methods.Embed()
			.setAuthor(this._queue[0].user.name, this._queue[0].user.url)
			.addField('Now Playing:', `[${this._queue[0].info.title}](${this._queue[0].info.uri})`)
			.setColor('RANDOM');
		channel.send(embed);
		const { track } = this._queue[0];
		this.client.lavalink.players.get(this.id).play(track, options);
		this.playing = true;
	}

	_handleEnd(event) {
		const shifted = this._queue.shift();
		this.playing = false;
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

	set channelID(value) {
		this._channelID = value;
	}

	get channelID() {
		return this._channelID;
	}

	get nowPlaying() {
		return this._queue[0];
	}
};
