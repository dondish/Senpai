const { Command } = require('klasa');

module.exports = class StatsCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'stats',
			enabled: false,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			aliases: [],
			permLevel: 0,
			botPerms: ['EMBED_MESSAGE'],
			description: 'Shows stats about this bot'
		});
	}

	async run(msg) { // eslint-disable-line no-unused-vars

	}
};
