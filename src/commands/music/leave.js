const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'leave',
	description: 'disconnect from voiceChannel im currently in!',
	aliases: [],
	examples: ['disconnect']
};

class LeaveCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const { voiceConnection } = msg.guild;
		if (voiceConnection === null) return msg.reply(`Im not in a Voice channel on this Server!`);
		const isLimited = await msg.guild.getConfig(this.client);
		if (isLimited.musicLimited) {
			const permissionLevel = await msg.member.getPermissionsLevel(this.client);
			if (permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!");
		}
		try {
			let { queue, loop, dispatcher } = msg.guild.getMusic();
			if (queue.length > 0) queue.length = 0;
			if (loop) msg.guild.setLoop(false);
			if (dispatcher) dispatcher.end();
			await voiceConnection.disconnect();
			await msg.channel.send('bye bye :wave:');
		} catch (error) {
			msg.channel.send('ooops! something went wrong while trying to leave to your Voicechannel please try to let me leave again!');
		}
	}
}

module.exports = LeaveCommand;
