const { Command } = require('klasa');
const { User } = require('discord.js');

module.exports = class ReminderCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'reminder',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			usage: '<time:duration> <reason:str> [channel:channel]',
			usageDelim: ' ',
			quotedStringSupport: true,
			aliases: ['remindme'],
			permLevel: 0,
			description: 'Reminds after an set time with the set reason.'
		});
	}

	async run(msg, [time, reason, channel = msg.author]) {
		const isDM = channel instanceof User;
		await this.client.schedule.create('reminder', time, {
			data: {
				user: msg.author.id,
				reason,
				channel: channel.id,
				isDM
			},
			catchUp: true
		});
		const embed = new this.client.methods.Embed()
			.setTitle('Reminder successfully added')
			.setDescription(reason)
			.addField('Channel:', channel.id === msg.author.id ? 'Direct Messages' : channel.toString())
			.setColor('GREEN')
			.setFooter('You will get reminded in')
			.setTimestamp(time);
		return msg.send(embed);
	}
};
