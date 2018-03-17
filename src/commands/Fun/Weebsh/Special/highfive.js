const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class HighfiveCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '<user>',
			botPerms: ['ATTACH_FILES'],
			description: 'Give or get high five'
		});
	}

	async run(msg, [user]) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed()
			.setTitle(`${user ? user : msg.member} 🖐`)
			.setImage(url)
		);
	}
};
