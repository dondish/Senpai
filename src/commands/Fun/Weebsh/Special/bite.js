const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class BiteCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '<user>',
			botPerms: ['ATTACH_FILES'],
			description: 'Bite someone or get bitten'
		});
	}

	async run(msg, [user]) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed()
			.setTitle(user ? `${msg.member} bit ${user}` : msg.member)
			.setImage(url)
		);
	}
};
