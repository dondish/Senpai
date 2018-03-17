const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class SmugCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['smirk'],
			botPerms: ['ATTACH_FILES'],
			description: '*Smirk*'
		});
	}

	async run(msg) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed().setImage(url));
	}
};
