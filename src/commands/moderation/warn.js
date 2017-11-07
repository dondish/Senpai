const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const info = {
	name: 'warn',
	description: 'warn the mentioned user',
	aliases: [],
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
		await member.addWarn(reason);
		const guildsettings = await msg.guild.getConfig();
		const embed = new RichEmbed()
			.setAuthor(msg.author.username, msg.author.avatarURL)
			.setColor(0x00AE86)
			.setTimestamp()
			.addField('Action', 'Warn')
			.addField('Target', `${member.user.tag} (${member.user.id})`)
			.addField('Reason', reason);
		await msg.channel.send(`warned the user ${member.user.tag}`);
		if (guildsettings.modlogID !== 'None') await msg.guild.channels.get(guildsettings.modlogID).send({ embed });
	}
}

module.exports = WarnCommand;
