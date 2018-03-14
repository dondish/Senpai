const { Task } = require('klasa');

module.exports = class extends Task {
	constructor(...args) {
		super(...args, { name: 'reminder', enabled: true });
	}

	run({ channel, user, reason, isDM }) {
		let _channel;
		if (isDM) _channel = this.client.users.get(channel);
		else _channel = this.client.channels.get(channel);
		return _channel.send(`<@${user}> You wanted me to remind you: ${reason}`);
	}
};
