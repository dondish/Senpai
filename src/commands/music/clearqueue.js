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
		const { me } = msg.guild;
		if (!me.voiceChannelID === null) return msg.reply(`Im not in a Voice channel on this Server!`);
		if (!msg.guild.music._queue.length === 0) return msg.reply(`The queue is empty already!`);
		msg.guild.music.clear();
		await msg.channel.send('i cleared the whole queue only the playing Song is left!');
	}
}

module.exports = ClearQueueCommand;
