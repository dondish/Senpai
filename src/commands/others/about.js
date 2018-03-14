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
		const result = await client.shard.fetchClientValues('guilds.size');
		const result2 = await client.shard.fetchClientValues('users.size');
		const result3 = await client.shard.fetchClientValues('channels.size');
		const serverCount = result.reduce((prev, val) => prev + val, 0);
		const userCount = result2.reduce((prev, val) => prev + val, 0);
		const channelcount = result3.reduce((prev, val) => prev + val, 0);
		const owner = client.users.get(client.constants.ownerID);
		const embed = new RichEmbed()
			.setTitle(`Stats & Infos`)
			.setAuthor(owner.username, owner.displayAvatarURL, 'http://yukine.ga/')
			.addField('Creator/Dev', 'Yukine', true)
			.addField('RAM usage:', `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`, true)
			.addField('Uptime', `${this.format(process.uptime())}`, true)
			.addField('Library', `Discord.js ${version}`, true)
			.addField('Node.js Version', process.version, true)
			.addField('Senpai Version:', this.client.version, true)
			.addField('Total Servers:', serverCount, true)
			.addField('Total Users:', userCount, true)
			.addField('Total Channels:', channelcount, true)
			.addField('Bot Invite Link', `[Link](${client.constants.inviteURL})`, true)
			.addField('GitHub', '[Senpai Github Repo](https://github.com/Dev-Yukine/Senpai)', true)
			.addField('Support Server', `[Server](${client.config.supportServerLink})`, true)
			.addField('Shards:', `${client.shard.id + 1}/${client.shard.count}`, true)
			.setTimestamp()
			.setColor('DARK_GREEN');
		await msg.channel.send(embed);
	}
}

module.exports = AboutCommand;
