const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'softban',
	description: 'bans and then unban the mentioned user',
	aliases: ['softbanne'],
	examples: ['ban @User annoying', 'ban @user spamming']
};

class SoftbanCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel >= 3) return msg.reply('You dont have permission to use this Command!');
		if (msg.mentions.members.size < 1) return msg.reply('You must mention someone for this Command.');
		let member = msg.mentions.members.first();
		if (!member.bannable) return msg.reply('I have no rights to ban/unban that User');
		if (msg.member.highestRole.comparePositionTo(member.highestRole) <= 0 && msg.guild.owner.id !== msg.author.id) return msg.reply("You can't softban someone with an higher or the same roleposition!");
		let reason = params.slice(1).join(' ');
		if (reason.length < 1) return msg.reply('You must supply a reason for the softban.');
		const message = await msg.channel.send(`trying to ban ${member.user.tag}`);
		try {
			await member.send(this._constructDM({ action: 'Softbanned', reason, serverName: msg.guild.name, moderator: msg.author.tag }));
		} catch (error) {
			// Nothing
		}
		const banned = await member.ban({
			reason,
			days: 7
		});
		const newMessage = await message.edit(`successfully banned ${member.user.tag} Awaiting unban ..`);
		const unbanned = await member.guild.unban(banned.user);
		await newMessage.edit(`successfully softbanned ${unbanned.tag}`);
		const { modlogChannel } = await msg.guild.getConfig();
		await member.createCase({ moderator: msg.author, reason, channel: msg.client.channels.get(modlogChannel), action: 'Softban' });
	}
}

module.exports = SoftbanCommand;
