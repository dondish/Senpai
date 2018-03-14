const { Event } = require('klasa');
const { join } = require('path');
const Lavalink = require(join(__dirname, '..', 'structures', 'Lavalink.js'));
const { lavalinkPW, lavalinkHost, lavalinkPortWS, LavalinkPort } = process.env;

module.exports = class ReadyEvent extends Event {
	constructor(...args) {
		super(...args, {
			name: 'ready',
			enabled: true,
			event: 'ready',
			once: false
		});
	}

	run() {
		this.client.console.debug('Connected/Reconnected to the Discord API');
		return this.client.user.setActivity(`${this.client.botConfig.prefix}help || Version: ${this.client.version}`);
	}

	async init() {
		this.client.lavalink = new Lavalink({
			password: lavalinkPW,
			shards: this.client.shard.count,
			userID: this.client.user.id,
			host: lavalinkHost,
			portWS: lavalinkPortWS,
			port: LavalinkPort
		});
		await this.client.lavalink.init();
		this.client.lavalink.on('error', err => this.emit('error', err));
		this.client.lavalink.on('event', this.client._lavalinkEvent.bind(this.client));
		this.client.console.debug('Lavalink Websocket Connection established');
	}
};
