const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class UpvoteCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'upvote',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			aliases: [],
			permLevel: 0,
			botPerms: ['EMBED_MESSAGE'],
			description: 'Shows where you can upvote Senpai and support me <3.'
		});
	}

	async run(msg) {
		const embed = new MessageEmbed()
			.addField(`You can upvote Senpai on this Link`, `[Click me!](${this.client.constants.voteLink}) \n I appreciate that very much <3`)
			.setColor(0x80ff00)
			.setTimestamp();
		await msg.sendEmbed(embed);
	}
};
