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
		const { voiceConnection } = msg.guild;
		if (!voiceConnection) return msg.reply(`Im not in a Voice channel on this Server!`);
		const { dispatcher } = msg.guild.music;
		if (!dispatcher) return msg.reply(`I don't play music at the moment!`);
		const { musicLimited } = await msg.guild.getConfig();
		if (musicLimited) {
			const permissionLevel = await msg.member.getPermissionsLevel();
			if (permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!");
		}
		dispatcher.end();
		msg.channel.send('Skipped the played Song!');
	}
}

module.exports = SkipCommand;
