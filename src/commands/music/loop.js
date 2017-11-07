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

	async run(msg) {
		const { voiceConnection } = msg.guild;
		if (voiceConnection === null) return msg.reply(`Im not in a Voice channel on this Server!`);
		const isLimited = await msg.guild.getConfig();
		if (isLimited.musicLimited) {
			const permissionLevel = await msg.member.getPermissionsLevel();
			if (permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!");
		}
		const { queue, loop } = msg.guild.getMusic();
		if (queue.length === 0) return msg.reply('You can`t loop an empty queue :eyes:');
		const boolean = loop;
		if (boolean === true) {
			msg.guild.setLoop(false);
			msg.channel.send('stopping the loop!');
		} else if (boolean === false) {
			msg.guild.setLoop(true);
			msg.channel.send('looping the current queue!');
		}
	}
}

module.exports = LoopCommand;
