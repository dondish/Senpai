const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const info = {
	name: 'blacklist',
	description: 'blacklist a user from using me',
	aliases: ['block'],
	examples: ['blacklist add @User [reason]', 'blacklist delete @User', 'blacklist show @User']
};

class BlacklistCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		const { client } = this;
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel >= 3) return msg.reply('You dont have permission to use this Command!');
		let parameter1 = params[0];
		if (!parameter1) {
			return msg.reply('you must choose if you wanna add or delete a user to the blacklist list :eyes:');
		} else {
			parameter1 = parameter1.toLowerCase();
			const parameter2 = params[1];
			let reason = params.slice(2).join(' ');
			if (!reason) reason = 'no reason provided';
			let member;
			if (msg.mentions.users.size === 0) {
				try {
					member = await msg.guild.fetchMember(parameter2);
				} catch (error) {
					return msg.reply('the provided UserID is not valid :eyes:');
				}
			} else {
				member = msg.mentions.members.first();
			}
			if (msg.member.highestRole.comparePositionTo(member.highestRole) <= 0 && msg.guild.owner.id !== msg.author.id) return msg.reply("You can't blacklist someone with a higher role or the same");
			if (parameter1 === 'add') {
				const result = await client.db.blacklist.getByID(member.user.id);
				if (result) return msg.reply('this user is already blacklisted');
				await client.db.blacklist.insertData({
					id: member.user.id,
					reason
				});
				const embed = new RichEmbed()
					.setAuthor(member.user.username, member.user.displayAvatarURL)
					.addField('I blacklisted the user', member.user.toString())
					.addField('with the reason', reason)
					.setColor(0x80ff00)
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				await msg.channel.send({ embed });
			} else if (parameter1 === 'delete') {
				const result = await client.db.blacklist.getByID(member.user.id);
				if (!result) return msg.reply('this user is not blacklisted!');
				await client.db.blacklist.getAndDelete(member.user.id);
				const embed = new RichEmbed()
					.setAuthor(member.user.username, member.user.displayAvatarURL)
					.addField('I removed this user from my blacklist', member.user.toString())
					.setColor(0x80ff00)
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				await msg.channel.send({ embed });
			} else if (parameter1 === 'show') {
				const result = await client.db.blacklist.getByID(member.user.id);
				if (!result) return msg.reply('this user is not blacklisted!');
				const embed = new RichEmbed()
					.setAuthor(member.user.username, member.user.displayAvatarURL)
					.addField('Reason:', result.reason)
					.setColor(0x80ff00)
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				await msg.channel.send({ embed });
			} else {
				return msg.reply('You provied a wrong first parameter');
			}
		}
	}
}

module.exports = BlacklistCommand;
