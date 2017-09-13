const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const info = {
	name: 'vote',
	description: 'shows where you can upvote Senpai and support me <3',
	aliases: ['upvote'],
	examples: ['vote']
};

class VoteCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	run(msg) {
		const embed = new RichEmbed()
			.addField(`You can upvote Senpai on this Link`, `[Click me!](${this.client.config.voteLink}) \n I appreciate that very much <3`)
			.setColor(0x80ff00)
			.setTimestamp()
			.setFooter('Senpai Bot by Yukine');
		msg.channel.send({ embed });
	}
}

module.exports = VoteCommand;
