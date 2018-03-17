const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class SleepyCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['sleep', 'slep'],
			botPerms: ['ATTACH_FILES'],
			description: 'I slep'
		});
	}

	async run(msg) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed().setImage(url));
	}
};
