const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class HugCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '<user>',
			botPerms: ['ATTACH_FILES'],
			description: 'Hug someone or get hugged'
		});
	}

	async run(msg, [user]) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed()
			.setTitle(user ? `${msg.member} hugged ${user}` : msg.member)
			.setImage(url)
		);
	}
};
