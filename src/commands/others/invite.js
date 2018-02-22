const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const info = {
	name: 'invite',
	description: 'shows the invite link of this Bot',
	aliases: ['link'],
	examples: ['invite']
};

class InviteCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const embed = new RichEmbed()
			.addField('Invite Link', `[Click Me](${this.client.constants.inviteURL})`)
			.setColor(0x80ff00)
			.setTimestamp();
		await msg.channel.send(embed);
	}
}

module.exports = InviteCommand;
