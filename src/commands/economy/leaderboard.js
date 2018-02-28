const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const info = {
	name: 'leaderboard',
	description: 'shows the top 10 user with the most money on this server',
	aliases: ['baltop', 'lb'],
	examples: ['leaderboard']
};

class LeaderboardCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const leaderboard = await msg.guild.getLeaderboard();
		let { currency } = this.client.constants;
		await msg.guild.fetchMembers();
		const mapped = [];
		for (const player of leaderboard) {
			const thisPlayer = msg.guild.members.get(player.user);
			if (thisPlayer) mapped.push(`${thisPlayer.user.tag} ${player.cash + player.bank}${currency}`);
		}
		if (mapped.length > 10) mapped.length = 10;
		const embed = new RichEmbed()
			.setTitle(`Leaderboard for ${msg.guild.name}`);
		let index = 1;
		for (let user of mapped) {
			embed.addField(`Rank #${index}`, user);
			index++;
		}
		await msg.channel.send(embed);
	}
}

module.exports = LeaderboardCommand;
