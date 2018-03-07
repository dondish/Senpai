const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'shuffle',
	description: 'shuffle the current queue',
	examples: ['shuffle']
};

class ShuffleCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const { me } = msg.guild;
		let { _queue } = msg.guild.music;
		if (!me.voiceChannelID) return msg.reply(`Im not in a Voice channel on this Server!`);
		if (!msg.guild.music.playing) return msg.reply(`I don't play music at the moment!`);
		if (_queue.length < 3) return msg.channel.send('You need atleast 3 songs in the queue to shuffle!');
		msg.guild.music.shuffle();
		await msg.channel.send('successfully shuffled the queue!');
	}
}

module.exports = ShuffleCommand;
