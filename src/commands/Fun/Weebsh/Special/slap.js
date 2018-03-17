const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class SlapCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '<user>',
			botPerms: ['ATTACH_FILES'],
			description: 'Slap someone or get slaped'
		});
	}

	async run(msg, [user]) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed()
			.setTitle(user ? `${msg.member} slapped ${user}` : msg.member)
			.setImage(url)
		);
	}
};
