const { Client, Collection } = require('discord.js');
const { version } = require('../../../package.json');
const Log = require('../new/Log.js');
const Database = require('../new/Database.js');

class SenpaiClient extends Client {
	constructor(options) {
		super(options);
		this.config = process.env;
		this.version = version;
		this.commands = new Collection();
		this.aliases = new Collection();
		this.log = new Log(this.shard.id);
		this.db = new Database();
		this.constants = {};
		this.once('ready', async () => {
			this.constants.application = await this.fetchApplication();
			this.constants.ownerID = this.constants.application.owner.id;
			this.constants.inviteURL = `https://discordapp.com/oauth2/authorize?client_id=${this.constants.application.id}&permissions=8&scope=bot`;
		});
	}
}

module.exports = SenpaiClient;

