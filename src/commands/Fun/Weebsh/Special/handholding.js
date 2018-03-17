const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class HandholdingCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '<user>',
			botPerms: ['ATTACH_FILES'],
			description: 'Hold someones hand or hold my hand'
		});
	}

	async run(msg, [user]) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed()
			.setTitle(user ? `${msg.member} grabs ${user}'s hand` : `${msg.member} Hold my hand ^.^`)
			.setImage(url)
		);
	}
};
