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

	async run(msg, args) {
		const { client } = this;
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel >= 3) return msg.reply('You dont have permission to use this Command!');
		let arg1 = args[0];
		if (!arg1) return msg.reply('you must choose if you wanna add or delete a user to the blacklist list :eyes:');
		arg1 = arg1.toLowerCase();
		const arg2 = args[1];
		let member;
		if (msg.mentions.users.size === 0) {
			try {
				member = await msg.guild.fetchMember(arg2);
			} catch (error) {
				return msg.reply('the provided UserID is not valid :eyes:');
			}
		} else {
			member = msg.mentions.members.first();
		}
		if (msg.member.highestRole.comparePositionTo(member.highestRole) <= 0 && msg.guild.owner.id !== msg.author.id) return msg.reply("You can't blacklist someone with a higher role or the same");
		if (arg1 === 'add') {
			this.add();
		} else if(arg1 === 'delete') {
			
		}
	}

	add() {

	}

	delete() {

	}
}

module.exports = BlacklistCommand;
