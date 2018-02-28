const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'loop',
	description: 'loops or remove the loop from your current queue!',
	aliases: ['repeat'],
	examples: ['loop']
};

class LoopCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	run(msg) {
		const { me } = msg.guild;
		if (!me.voiceChannelID) return msg.reply(`Im not in a Voice channel on this Server!`);
		const { queue, loop } = msg.guild.music;
		if (queue.length === 0) return msg.reply('You can`t loop an empty queue :eyes:');
		if (loop) {
			msg.guild.music.loop = false;
			msg.channel.send('stopping the loop!');
		} else if (!loop) {
			msg.guild.music.loop = true;
			msg.channel.send('looping the current queue!');
		}
	}
}

module.exports = LoopCommand;
