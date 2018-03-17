const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['doggo', 'kitty', 'kitten'],
			botPerms: ['ATTACH_FILES'],
			description: 'Catto'
		});
	}

	async run(msg) {
		const { url } = await this.client.weebAPI.getRandom({ type: `animal_${this.name}`, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed().setImage(url));
	}
};
