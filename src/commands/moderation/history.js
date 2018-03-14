const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const info = {
	name: 'history',
	description: 'shows the moderation history of the mentioned user',
	examples: ['history @User']
};

class HistoryCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		let member = msg.mentions.members.first();
		if (!member) member = msg.member;
		const { warnCount, banCount, kickCount, muteCount } = await member.getHistory();
		const embed = new RichEmbed()
			.setAuthor(member.user.tag, member.user.displayAvatarURL)
			.setFooter(`This user has ${warnCount} warnings, ${muteCount} mutes, ${kickCount} kicks, and ${banCount} bans.`);
		msg.channel.send(embed);
	}
}

module.exports = HistoryCommand;
