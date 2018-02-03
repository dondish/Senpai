const Events = require('../structures/new/Event.js');

class guildMemberAdd extends Events {
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
		updatedText = replace(text, '{{user}}', member);
		updatedText = replace(text, '{{username}}', member.user.username);
		updatedText = replace(text, '{{server}}', member.guild.name);
		updatedText = replace(text, '{{memberCount}}', member.guild.memberCount);
		return updatedText;
	}

	replace(text, search, replacement) {
		return text.replace(RegExp(search, 'gi'), replacement);
	}
}

module.exports = guildMemberAdd;
