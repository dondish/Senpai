const { Client, Collection } = require('discord.js');
const { version } = require('../../../package.json');
const DBHandler = require('../new/HandleDB.js');
const Music = require('../new/Music.js');
const Log = require('../new/Log.js');

class SenpaiClient extends Client {
	constructor(options) {
		super(options);
		this.db = new DBHandler('Discord');
		this.music = Music;
		this.config = require('../../config/config.json');
		this.version = version;
		this.commands = new Collection();
		this.aliases = new Collection();
		this.log = new Log(this.shard.id);
	}
}

module.exports = SenpaiClient;
