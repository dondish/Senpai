const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class InviteCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'invite',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			permLevel: 0,
			botPerms: ['EMBED_MESSAGE'],
			description: 'Shows my Invite Link.'
		});
	}

	async run(msg) {
		const embed = new MessageEmbed()
			.addField('Invite Link', `[Click Me](${this.client.constants.inviteURL})`)
			.setColor(0x80ff00)
			.setTimestamp();
		await msg.send(embed);
	}
};
