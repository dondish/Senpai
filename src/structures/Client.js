const { Client } = require('klasa');
const { join } = require('path');
const WolkeHandler = require('wolken');
const { version } = require(join(__dirname, '..', '..', 'package.json'));
const BotListHandler = require(join(__dirname, 'BotListHandler.js'));
const {
	bottoken,
	prefix,
	osuToken,
	googleToken,
	omwToken,
	dBotsToken,
	discordbotsToken,
	wolkeToken,
	supportServerLink,
	voteLink,
	pixabayToken,
	databaseName,
	databaseUser,
	databasePW,
	databaseHost
} = process.env;

module.exports = class SenpaiClient extends Client {
	constructor(options) {
		super(options);
		this.version = version;
		this.tokens = { bottoken, osuToken, googleToken, omwToken, dBotsToken, discordbotsToken, pixabayToken, wolkeToken };
		this.constants = { supportServerLink, voteLink };
		this.botConfig = { prefix };
		this.databaseConfig = { databaseHost, databaseName, databaseUser, databasePW };
		this.lavalink = null;
		this.weebAPI = new WolkeHandler(this.tokens.wolkeToken, 'Wolke');
		this.botListHandler = new BotListHandler(this);
	}

	_lavalinkEvent(event) {
		const guild = this.guilds.get(event.guildId);
		if (event.type === 'TrackEndEvent') {
			if (guild) guild.music.emit('TrackEnd', event);
		}
	}
};
