const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class DeredereCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			botPerms: ['ATTACH_FILES'],
			description: 'Deredere!'
		});
	}

	async run(msg) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed().setImage(url));
	}
};
