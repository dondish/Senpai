const { Client, Collection } = require('discord.js');
const { version } = require('../../../package.json');
const Database = require('../new/Database.js');
const Log = require('../new/Log.js');

class SenpaiClient extends Client {
	constructor(options) {
		super(options);
		this.config = require('../../config/config.json');
		this.version = version;
		this.commands = new Collection();
		this.aliases = new Collection();
		this.log = new Log(this.shard.id);
		this.db = new Database('Discord', this.log);
	}
}

module.exports = SenpaiClient;
