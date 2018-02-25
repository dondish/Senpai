const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'clearqueue',
	description: 'clear the whole queue only the playing song will stay!',
	aliases: [],
	examples: ['clearqueue']
};

class ClearQueueCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const { voiceConnection } = msg.guild;
		if (voiceConnection === null) return msg.reply(`Im not in a Voice channel on this Server!`);
		if (!msg.guild.music.playing) return msg.reply(`I don't play music at the moment!`);
		msg.guild.music._queue.length = 1;
		await msg.channel.send('i cleared the whole queue only the playing Song is left!');
	}
}

module.exports = ClearQueueCommand;
