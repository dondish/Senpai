const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class DoggoCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['doggo', 'pupper', 'puppy', 'pup'],
			botPerms: ['ATTACH_FILES'],
			description: 'Doggo'
		});
	}

	async run(msg) {
		const { url } = await this.client.weebAPI.getRandom({ type: `animal_${this.name}`, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed().setImage(url));
	}
};
