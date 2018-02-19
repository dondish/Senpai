const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const { ownerID } = require('../../config/config.json');
const info = {
	name: 'upvote',
	description: 'shows where you can upvote Senpai and support me <3',
	examples: ['upvote']
};

class UpvoteCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	run(msg) {
		const embed = new RichEmbed()
			.addField(`You can upvote Senpai on this Link`, `[Click me!](${this.client.config.voteLink}) \n I appreciate that very much <3`)
			.setColor(0x80ff00)
			.setTimestamp()
			.setFooter('Senpai Bot by Yukine', this.client.users.get(ownerID).displayAvatarURL);
		msg.channel.send(embed);
	}
}

module.exports = UpvoteCommand;
