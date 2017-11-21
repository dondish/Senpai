const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const { ownerID } = require('../../config/config.json');
const info = {
	name: 'ratewaifu',
	description: 'rate your waifu with an scale from 0 to 10',
	aliases: ['waifu'],
	examples: ['ratewaifu']
};

class WaifuCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		let waifu = params.join(' ');
		if (!waifu) return msg.channel.send('You must supply a waifu to rate!');
		if (msg.mentions.users.size === 1) waifu = msg.mentions.users.first().username;
		const random = Math.round(Math.random() * 10);
		const embed = new RichEmbed()
			.setAuthor(msg.client.user.username, msg.client.user.displayAvatarURL)
			.addField(`I Rate your waifu ${waifu}`, `${random}/10`)
			.setColor(0x80ff00)
			.setTimestamp()
			.setFooter('Senpai Bot by Yukine', this.client.users.get(ownerID).displayAvatarURL);
		await msg.channel.send({ embed });
	}
}

module.exports = WaifuCommand;
