const Commands = require('../../structures/new/Command.js');
const { RichEmbed, version } = require('discord.js');
const info = {
	name: 'about',
	description: 'shows information about me and my creator',
	aliases: ['info'],
	examples: ['about']
};

class AboutCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const { client } = this;
		function format(seconds) {
			function pad(seconds3) {
				return (seconds3 < 10 ? '0' : '') + seconds3;
			}
			let hours = Math.floor(seconds / (60 * 60));
			let minutes = Math.floor(seconds % (60 * 60) / 60);
			let seconds2 = Math.floor(seconds % 60);

			return `${pad(hours)}:${pad(minutes)}:${pad(seconds2)}`;
		}
		const result = await client.shard.fetchClientValues('guilds.size');
		const result2 = await client.shard.fetchClientValues('users.size');
		const userCount = result2.reduce((prev, val) => prev + val, 0);
		const serverCount = result.reduce((prev, val) => prev + val, 0);
		const owner = client.users.get(client.config.ownerID);
		const embed = new RichEmbed()
			.setTitle(`About Senpai version: ${this.client.version}`)
			.setAuthor(owner.username, owner.displayAvatarURL)
			.addField('Creator/Dev', 'Yukine', true)
			.addField('RAM usage:', `${Math.round(process.memoryUsage().heapTotal / 1000000)}MB`, true)
			.addBlankField(true)
			.addField('Libary', `Discord.js ${version}`, true)
			.addField('Node.js Version', process.version, true)
			.addBlankField(true)
			.addField('Total Servers:', serverCount, true)
			.addField('Total Users:', userCount, true)
			.addField('Total Shards:', `${client.shard.count}`, true)
			.addField('Uptime', `${format(process.uptime())}`)
			.addField('Bot Invite Link', `[Link](${client.config.inviteURL})`, true)
			.addField('GitHub', '[Senpai-Bot Github Repo](https://github.com/Dev-Yukine/Senpai-Bot-Discord)', true)
			.addField('Support Server', `[Server](${client.config.supportServerLink})`, true)
			.setTimestamp()
			.setColor('DARK_GREEN');
		msg.channel.send({ embed });
	}
}

module.exports = AboutCommand;
