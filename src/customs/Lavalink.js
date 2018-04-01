const { Piece } = require('klasa');
const { Client } = require('lavalink');
const { lavalinkPW, lavalinkHost, lavalinkPortWS, LavalinkPort } = process.env;
const { get } = require('snekfetch');
const { join } = require('path');
const { MusicError } = require(join(__dirname, '..', 'util', 'CustomErrors.js'));

class LavalinkClient extends Client {
	constructor({ userID, password, port, host, portWS, client }) {
		super({
			password,
			userID
		});
		this.port = port;
		this.host = host;
		this.portWS = portWS;
		this.client = client;
	}

	get wsURL() {
		return `ws://${this.host}:${this.portWS}`;
	}

	send(guildID, packet) {
		if (this.client.guilds.has(guildID)) this.client.ws.send(packet);
	}


	init() {
		return this.connect(this.wsURL);
	}

	async resolveTrack(query) {
		const { body } = await get(`http://${this.host}:${this.port}/loadtracks?identifier=${query.replace(/<(.+)>/g, '$1')}`)
			.set('Authorization', this.password)
			.set('Accept', 'application/json');
		if (!body) throw new MusicError('Unable play that Song.');
		else if (!body[0]) throw new MusicError('No Song found.');
		return body;
	}
}

module.exports = class Lavalink extends Piece {
	constructor(...args) {
		super(...args, {
			name: 'Lavalink',
			enabled: true
		});
	}

	async init() {
		this.lavalink = new LavalinkClient({
			userID: this.client.user.id,
			password: lavalinkPW,
			host: lavalinkHost,
			port: LavalinkPort,
			portWS: lavalinkPortWS,
			client: this.client
		});
		await this.lavalink.init();
		this.client.console.debug('Lavalink Websocket Connection established');
		this.lavalink.on('error', err => this.client.emit('error', err));
		this.lavalink.on('event', this._lavalinkEvent.bind(this));
	}

	_lavalinkEvent(event) {
		const guild = this.client.guilds.get(event.guildId);
		if (event.type === 'TrackEndEvent') {
			if (guild) guild.music.emit('TrackEnd', event);
		}
	}
};
