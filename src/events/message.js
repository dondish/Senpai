const Events = require('../structures/new/Event.js');

class MessageEvent extends Events {
	constructor(client) {
		super(client);
		this.name = 'message';
	}

	async run(msg) {
		const { client } = this;
		if (msg.author.bot) return;
		if (!msg.guild) return;
		if (!msg.member) msg.member = await msg.guild.fetchMember(msg.author);
		const blacklisted = await msg.member.isBlacklisted();
		if (blacklisted) return;
		msg.guild.economy.messageUpdate(msg.member);
		let { prefix, disabledCommandCategories, disabledCommands, inviteLinkProtection } = await msg.guild.getConfig();
		prefix = prefix ? prefix : client.config.prefix;
		try {
			if (inviteLinkProtection) {
				if (this.inviteLink(msg.content)) {
					await msg.delete();
					return msg.reply('Invite Links are forbidden on this Server!');
				}
			}
		} catch (error) {
			return msg.channel.send('Invite Links are forbidden on this Server! but i have no permission to delete this message.');
		}
		if (!msg.content.startsWith(prefix) && !this.mentioned(msg.content)) return;
		let params;
		let command;
		if (msg.content.startsWith(prefix)) {
			params = this.createParams(msg);
			command = this.getCommand(msg, prefix);
		} else if (this.mentioned(msg.content)) {
			params = this.createParamsMention(msg);
			command = this.getCommandMention(msg);
		}
		let cmd;
		if (client.commands.has(command)) {
			cmd = client.commands.get(command);
		} else if (client.aliases.has(command)) {
			cmd = client.commands.get(client.aliases.get(command));
		}
		if (cmd) {
			if (disabledCommands.includes(cmd.name) || disabledCommandCategories.includes(cmd.group)) return;
			try {
				this.client.emit('commandRun', this, msg);
				await cmd.run(msg, params);
			} catch (error) {
				this.client.emit('commandError', error, this, msg);
			}
		}
	}

	createParamsMention(msg) {
		const params = msg.content.split(' ').slice(2);
		return params;
	}

	getCommandMention(msg) {
		const command = msg.content.split(' ')[1].toLowerCase();
		return command;
	}

	createParams(msg) {
		const params = msg.content.split(' ').slice(1);
		return params;
	}

	getCommand(msg, prefix) {
		const command = msg.content.split(' ')[0].slice(prefix.length).toLowerCase();
		return command;
	}

	mentioned(input) {
		const RegEx = new RegExp(`^(<@)(!?)(${this.client.user.id}> )`);
		return RegEx.test(input);
	}

	inviteLink(content) {
		if (/(https:\/\/|http:\/\/)(discord.me\/)[a-z]*/.test(content) || /(https:\/\/|http:\/\/)(discord)(app\.com\/invite|\.gg)\/\w{5,7}/.test(content)) {
			return true;
		} else {
			return false;
		}
	}
}

module.exports = MessageEvent;
