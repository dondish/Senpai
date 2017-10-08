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
		let { queue, dispatcher } = msg.guild.getMusic();
		if (!dispatcher) return msg.reply(`I don't play music at the moment!`);
		const isLimited = await msg.guild.getConfig(this.client);
		if (isLimited.musicLimited) {
			const permissionLevel = await msg.member.getPermissionsLevel(this.client);
			if (permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!");
		}
		queue.length = 1;
		await msg.channel.send('i cleared the whole queue only the playing Song is left!');
	}
}

module.exports = ClearQueueCommand;
