const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'skip',
	description: 'skip the current playing song',
	aliases: ['next'],
	examples: ['skip']
};

class SkipCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		if (!msg.guild.music.playing) return msg.reply(`Im not playing music!`);
		msg.guild.music.stop();
		await msg.channel.send('Skipped the played Song!');
	}
}

module.exports = SkipCommand;
