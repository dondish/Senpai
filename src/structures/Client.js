const { Client } = require('klasa');
const { join } = require('path');
const { version } = require(join(__dirname, '..', '..', 'package.json'));
const CustomPieceStore = require(join(__dirname, 'CustomPieceStore.js'));
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
		this.customPieceStore = new CustomPieceStore(this);
		this.registerStore(this.customPieceStore);
		this.registerPiece('BotListHandler', this.customPieceStore);
		this.registerPiece('CacheSync', this.customPieceStore);
		this.registerPiece('Lavalink', this.customPieceStore);
	}
};
