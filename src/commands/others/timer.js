const Commands = require('../../structures/new/Command.js');
const { parse } = require('sherlockjs');
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

	run(msg, params) {
		if (params.length < 1) return msg.reply('You must add atleast a time to remind you!');
		if (!this.validateTime(params.join(' '))) return msg.reply('seems like your Date is invalid! please try again');
		const timeObject = this.parseTime(params.join(' '));
		const time = timeObject.startDate.getTime() - Date.now();
		msg.channel.send(`I will remind you in ${this.format(time / 1000)}`);
		setTimeout(() => msg.channel.send(`${msg.author} you wanted me to remind you. Reason: ${this.clean(timeObject.eventTitle) ? this.clean(timeObject.eventTitle) : 'no reason provided'}`), time);
	}

	parseTime(input) {
		const remindTime = parse(input);
		return remindTime;
	}

	validateTime(input) {
		const remindTime = parse(input);
		if (!remindTime.startDate) return false;
		return true;
	}

	clean(text) {
		if (typeof text === 'string') {
			return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
		} else {
			return text;
		}
	}

	format(seconds) {
		const { pad } = this;
		let hours = Math.floor(seconds / (60 * 60));
		let minutes = Math.floor(seconds % (60 * 60) / 60);
		let seconds2 = Math.floor(seconds % 60);

		return `${pad(hours)}:${pad(minutes)}:${pad(seconds2)}`;
	}

	pad(seconds) {
		return (seconds < 10 ? '0' : '') + seconds;
	}
}

module.exports = TimerCommand;
