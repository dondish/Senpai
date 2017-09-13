const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const info = {
	name: 'ping',
	description: 'shows the ping of the bot in ms',
	aliases: ['pong'],
	examples: ['ping']
};

class PingCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const sent = await msg.channel.send('Pinging...');
		const embed = new RichEmbed()
			.setAuthor(`${msg.client.user.username}`, `${msg.client.user.displayAvatarURL}`)
			.setTitle('Pong! :ping_pong:')
			.addField('Heartbeat', `${Math.floor(msg.client.ping)}ms`, true)
			.addField('Message', `${sent.createdTimestamp - msg.createdTimestamp}ms`, true)
			.setColor(0x80ff00)
			.setTimestamp()
			.setFooter('Senpai Bot by Yukine');
		sent.edit({ embed });
	}
}

module.exports = PingCommand;
