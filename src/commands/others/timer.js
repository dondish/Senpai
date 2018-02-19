const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'timer',
	description: 'remind you about something',
	aliases: ['remindme', 'reminder'],
	examples: ['timer 5 minutes look after the food', 'timer 1h go sleep']
};

class TimerCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		if (params.length < 1) return msg.reply('You must add atleast a time to remind you!');
		if (!this.validateTime(params.join(' '))) return msg.reply('seems like your Date is invalid! please try again');
		const { startDate, eventTitle } = this.parseTime(params.join(' '));
		const time = startDate.getTime() - new Date().getTime();
		msg.channel.send(`I will remind you in ${this.format(time / 1000)}`);
		const { dataValues } = await this.client.db.timers.create({
			user: msg.author.id,
			date: startDate,
			message: this.clean(eventTitle) ? this.clean(eventTitle) : 'no reason provided',
			channel: msg.channel.id
		});
		setTimeout(() => {
			this.client.channels.get(dataValues.channel).send(`${msg.author} you wanted me to remind you. Reason: ${this.clean(dataValues.message)}`);
			this.client.db.timers.findById(dataValues.id).destroy();
		}, time);
	}
}

module.exports = TimerCommand;
