const {Client, Collection} = require('discord.js')
const {version} = require('../../../package.json')
const DBHandler = require('../new/HandleDB.js')
const Music = require('../new/Music.js')
const Database = new DBHandler('Discord')

class SenpaiClient extends Client {
    constructor(options) {
        super(options)
        this.db = Database
        this.music = Music
        this.config = require('../../config/config.json');
        this.version = version
        this.commands = new Collection();
        this.aliases = new Collection();
    }
}

module.exports = SenpaiClient
