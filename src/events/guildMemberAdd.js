const Events = require('../structures/new/Event.js');

class GuildMemberAdd extends Events {
	constructor(client) {
		super(client);
		this.name = 'guildMemberAdd';
	}

	async run(member) {
		const { welcomeEnabled, welcomeChannel, welcomeMessage } = await member.guild.getConfig();
		if (!welcomeEnabled || !welcomeChannel) return;
		member.guild.channels.get(welcomeChannel).send(this.replaceAll(welcomeMessage, member));
	}

	replaceAll(text, member) {
		const { replace } = this;
		let updatedText;
		updatedText = replace(text, '{{user}}', member.toString());
		updatedText = replace(updatedText, '{{username}}', member.user.username);
		updatedText = replace(updatedText, '{{server}}', member.guild.name);
		updatedText = replace(updatedText, '{{memberCount}}', member.guild.memberCount);
		return updatedText;
	}

	replace(text, search, replacement) {
		return text.replace(RegExp(search, 'gi'), replacement);
	}
}

module.exports = GuildMemberAdd;
