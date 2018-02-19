const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'warn',
	description: 'warn the mentioned user',
	examples: ['warn @User annoying', 'warn @User spamming', 'warn @User bad language']
};

class WarnCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel >= 3) return msg.reply('You dont have permission to use this Command!');
		if (msg.mentions.members.size < 1) return msg.reply('You must mention someone for this Command.');
		let member = msg.mentions.members.first();
		if (msg.member.highestRole.comparePositionTo(member.highestRole) <= 0 && msg.guild.owner.id !== msg.author.id) return msg.reply("You can't warn someone with an higher or the same roleposition!");
		let reason = params.slice(1).join(' ');
		if (reason.length < 1) return msg.reply('You must supply a reason for the warn.');
		const message = await msg.channel.send(`trying to warn ${member.user.tag}`);
		try {
			await member.send(this._constructDM({ action: 'Warned', reason, serverName: msg.guild.name, moderator: msg.author.tag }));
		} catch (error) {
			// Nothing
		}
		await message.edit(`warned the user ${member.user.tag}`);
		const { modlogChannel } = await msg.guild.getConfig();
		await member.createCase({ moderator: msg.author, reason, channel: msg.client.channels.get(modlogChannel), action: 'Warn' });
	}
}

module.exports = WarnCommand;
