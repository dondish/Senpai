const { Command, version: klasaVersion } = require('klasa');
const { MessageEmbed, version } = require('discord.js');

module.exports = class InfoCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'info',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			aliases: ['about'],
			permLevel: 0,
			botPerms: ['EMBED_MESSAGE'],
			description: 'Shows information about me and my creator.'
		});
	}

	async run(msg) {
		const { client } = this;
		const result = await client.shard.fetchClientValues('guilds.size');
		const result2 = await client.shard.fetchClientValues('users.size');
		const result3 = await client.shard.fetchClientValues('channels.size');
		const serverCount = result.reduce((prev, val) => prev + val, 0);
		const userCount = result2.reduce((prev, val) => prev + val, 0);
		const channelcount = result3.reduce((prev, val) => prev + val, 0);
		const owner = client.users.get(client.owner.id);
		const embed = new MessageEmbed()
			.setTitle(`Stats & Infos`)
			.setAuthor(owner.username, owner.displayAvatarURL(), 'http://yukine.ga/')
			.addField('Creator/Dev', 'Yukine', true)
			.addField('RAM usage:', `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`, true)
			.addField('Uptime', `${this.format(process.uptime())}`, true)
			.addField('Library', `Discord.js ${version}`, true)
			.addField('Framework:', `Klasa ${klasaVersion}`, true)
			.addField('Node.js Version', process.version, true)
			.addField('Total Servers:', serverCount, true)
			.addField('Total Users:', userCount, true)
			.addField('Total Channels:', channelcount, true)
			.addField('Bot Invite Link', `[Link](${client.constants.inviteURL})`, true)
			.addField('GitHub', '[Senpai Github Repo](https://github.com/Discord-Senpai/Senpai)', true)
			.addField('Support Server', `[Server](${client.constants.supportServerLink})`, true)
			.addField('Shards:', `${client.shard.id + 1}/${client.shard.count}`, true)
			.addField('Senpai Version:', this.client.version, true)
			.setTimestamp()
			.setColor('DARK_GREEN');
		return msg.sendEmbed(embed);
	}

	async init() {
		this.client.constants.inviteURL = await this.client.generateInvite(['ADMINISTRATOR']);
	}
};
