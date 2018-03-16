const { Command } = require('klasa');

module.exports = class SkipCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'skip',
			enabled: true,
			runIn: ['text'],
			cooldown: 5,
			bucket: 1,
			aliases: ['next'],
			permLevel: 0,
			description: 'Skip the currently playing song'
		});
	}

	run(msg) {
		msg.guild.music.stop();
		return msg.send('Skipped the played Song!');
	}
};
