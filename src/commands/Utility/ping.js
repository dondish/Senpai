const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class PingCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'ping',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			aliases: ['pong'],
			permLevel: 0,
			botPerms: ['EMBED_MESSAGE'],
			description: 'Shows my current Ping to the Discord API'
		});
	}

	async run(msg) {
		const sent = await msg.send('Pinging...');
		const embed = new MessageEmbed()
			.setAuthor(`${this.client.user.username}`, `${this.client.user.displayAvatarURL()}`)
			.setTitle('Pong! :ping_pong:')
			.addField('Heartbeat', `${Math.floor(this.client.ping)}ms`, true)
			.addField('Message', `${sent.createdTimestamp - msg.createdTimestamp}ms`, true)
			.setColor(0x80ff00)
			.setTimestamp();
		return sent.edit({ embed });
	}
};
