const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class BangHeadCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['headbang'],
			botPerms: ['ATTACH_FILES'],
			description: 'TRAPS ARE FUCKING GAY!'
		});
	}

	async run(msg) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed().setImage(url));
	}
};
