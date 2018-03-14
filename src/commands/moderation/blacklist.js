const Commands = require('../../structures/new/Command.js');
const { DatabaseError } = require('../../structures/new/CustomErrors.js');
const info = {
	name: 'blacklist',
	description: 'blacklist a user from using me',
	aliases: ['block'],
	examples: ['blacklist add @User', 'blacklist delete @User']
};

class BlacklistCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, args) {
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel > 3) return msg.reply('You dont have permission to use this Command!');
		let arg1 = args[0];
		if (!arg1) return msg.reply('you must choose if you wanna add or delete a user to/from the blacklist list :eyes:');
		arg1 = arg1.toLowerCase();
		const arg2 = args[1];
		const global = args[3] ? args[3].toLowerCase() === '-g' : false;
		if (global && permissionLevel > 0) return msg.reply('Only the Bot Owner has permission to global Blacklist members from using me!');
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
			await this.add(member, global);
		} else if (arg1 === 'delete') {
			await this.delete(member, global);
		} else {
			return msg.reply('This Command only accpets `add` or `delete` as first parameter!');
		}
	}

	async add(member, global) {
		const { client } = this;
		const [user] = await client.db.blacklist.findOrCreate({ where: { id: member.id } });
		if (global) {
			if (user.global) throw new DatabaseError('User already global blacklisted!');
			return user.update({ global });
		} else {
			if (user.guilds.includes(member.guild.id)) throw new DatabaseError('User already blacklisted!');
			user.guilds.push(member.guild.id);
			return user.update({ guilds: user.guilds });
		}
	}

	async delete(member, global) {
		const { client } = this;
		const [user] = await client.db.blacklist.findOrCreate({ where: { id: member.id } });
		if (!user) throw new DatabaseError('User is not blacklisted!');
		if (global) {
			if (!user.global) throw new DatabaseError('User is not global blacklisted!');
			return user.update({ global: !global });
		} else {
			if (!user.guilds.includes(member.guild.id)) throw new DatabaseError('User not blacklisted!');
			user.guilds.splice(user.guilds.indexOf(member.guild.id), 1);
			return user.update({ guilds: user.guilds });
		}
	}
}

module.exports = BlacklistCommand;
