const { Command } = require('klasa');

module.exports = class NowPlayingCommand extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			aliases: ['np'],
			description: 'Shows information about the current playing Song.'
		});
	}

	run(msg) {
		const { nowPlaying } = msg.guild.music;
		return msg.send(
			new this.client.methods.Embed()
				.setDescription(`[${nowPlaying.info.title}](${nowPlaying.info.uri})`)
				.addField('Author', nowPlaying.info.author, true)
				.addField('Livestream?', nowPlaying.info.isStream ? 'Yes' : 'No', true)
				.addField('Length', nowPlaying.info.isStream ? '∞ (Livestream)' : this.format(nowPlaying.info.length / 1000), true)
				.setColor(0xffcc00)
		);
	}
};
