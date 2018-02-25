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
			const channel = this.client.channels.get(this.channelID);
			channel.send(`Now Playing: ${this._queue[0].info.title}`);
			return this._play();
		}
	}

	stop() {
		this.client.lavalink.players.get(this.id).stop();
	}

	_play(options) {
		const { track } = this._queue[0];
		this.client.lavalink.players.get(this.id).play(track, options);
		this.playing = true;
	}

	_handleEnd(event) {
		const shifted = this._queue.shift();
		this.playing = false;
		if (event.reason === 'FINISHED') return this._finished(event, shifted);
		else if (event.reason === 'STOPPED') return this._failed(event, shifted);
		else if (event.reason === 'FAILED') return this._failed(event);
	}

	_finished(event, shifted) {
		if (this.loop) this._queue.push(shifted);
		if (!this._queue.length) return;
		const channel = this.client.channels.get(this.channelID);
		channel.send(`Now Playing: ${this._queue[0].info.title}`);
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
		const channel = this.client.channels.get(this.channelID);
		channel.send(`Skipped the played Song!`);
		if (!this._queue.length) return;
		return this._play();
	}

	set channelID(value) {
		this._channelID = value;
	}

	get channelID() {
		return this._channelID;
	}
};
