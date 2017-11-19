const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'join',
	description: 'joins your current voiceChannel',
	aliases: ['summon'],
	examples: ['join']
};

class JoinCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const { voiceChannel } = msg.member;
		let { voiceConnection } = msg.guild;
		if (!voiceChannel) return msg.reply('You must be in a Voice channel to use this Command!');
		if (!voiceChannel.joinable) return msg.reply('I have no rights to join your Voice channel!');
		if (!voiceChannel.speakable) return msg.reply('I have no rights to speak in your Voice channel!');
		if (voiceConnection !== null) return msg.reply(`Im already in a Voice channel on this Server!`);
		const isLimited = await msg.guild.getConfig();
		if (isLimited.musicLimited) {
			const permissionLevel = await msg.member.getPermissionsLevel();
			if (permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!");
		}
		try {
			await voiceChannel.join();
			await msg.channel.send('successfull joined your Voice Channel');
		} catch (error) {
			msg.channel.send('ooops! something went wrong while trying to connect to your Voicechannel please try to let me join again');
		}
	}
}

module.exports = JoinCommand;
