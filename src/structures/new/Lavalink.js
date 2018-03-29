const { Client } = require('lavalink');
const { get } = require('snekfetch');
const { MusicError } = require('./CustomErrors.js');

module.exports = class LavalinkClient extends Client {
	constructor({ password, shards, userID, host, portWS, port, client }) {
		super({ password, shards, userID });
		this.host = host;
		this.portWS = portWS;
		this.port = port;
		this.client = client;
	}

	get wsURL() {
		return `ws://${this.host}:${this.portWS}`;
	}

	send(guild, packet) {
		if (this.client.guilds.has(guild.id)) this.discordClient.ws.send(packet);
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
};
