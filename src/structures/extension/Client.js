const { lavalinkPW, lavalinkShards, lavalinkHost, lavalinkPortWS, LavalinkPort, UserID } = process.env;
const { Client, Collection } = require('discord.js');
const { version } = require('../../../package.json');
const Database = require('../new/Database.js');
const Lavalink = require('../new/Lavalink.js');
const Log = require('../new/Log.js');

class SenpaiClient extends Client {
	constructor(options) {
		super(options);
		this.config = process.env;
		this.version = version;
		this.categories = [];
		this.commands = new Collection();
		this.aliases = new Collection();
		this.log = new Log(this.shard.id);
		this.db = new Database();
		this.lavalink = new Lavalink({
			password: lavalinkPW,
			shards: Number(lavalinkShards),
			userID: UserID,
			host: lavalinkHost,
			portWS: lavalinkPortWS,
			port: LavalinkPort,
			client: this
		});
		this.lavalink.init();
		this.lavalink.on('error', err => this.emit('error', err));
		this.lavalink.on('event', this._lavalinkEvent.bind(this));
		this.constants = {};
		this.globalEmoji = {
			currency: 'a:money:419122091414126592',
			error: 'Error:361218228103675905',
			sucess: 'success:353893835572772875'
		};
		this.once('ready', async () => {
			this.constants.application = await this.fetchApplication();
			this.constants.ownerID = this.constants.application.owner.id;
			this.constants.inviteURL = `https://discordapp.com/oauth2/authorize?client_id=${this.constants.application.id}&permissions=8&scope=bot`;
		});
	}

	_lavalinkEvent(event) {
		const guild = this.guilds.get(event.guildId);
		if (event.type === 'TrackEndEvent') {
			if (guild) guild.music.emit('TrackEnd', event);
		}
	}
}

module.exports = SenpaiClient;

