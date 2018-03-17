const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class PokeCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '<user>',
			botPerms: ['ATTACH_FILES'],
			description: 'Poke someone or get poked'
		});
	}

	async run(msg, [user]) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed()
			.setTitle(user ? `${msg.member} poked ${user}` : msg.member)
			.setImage(url)
		);
	}
};
