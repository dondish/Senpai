const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class TickleCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '<user>',
			botPerms: ['ATTACH_FILES'],
			description: 'Get tickled or tickle someone'
		});
	}

	async run(msg, [user]) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new MessageEmbed()
			.setTitle(user ? `${msg.member} tickled ${user}` : 'Tickle tickle tickle')
			.setImage(url)
		);
	}
};
