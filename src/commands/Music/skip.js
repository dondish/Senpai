const { Command } = require('klasa');

module.exports = class SkipCommand extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			aliases: ['next'],
			description: 'Skip the currently playing song'
		});
	}

	run(msg) {
		msg.guild.music.stop();
		return msg.send('Skipped the played Song!');
	}
};
