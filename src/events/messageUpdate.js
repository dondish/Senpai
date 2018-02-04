const Events = require('../structures/new/Event.js');

class MessageUpdateEvent extends Events {
	constructor(client) {
		super(client);
		this.name = 'messageUpdate';
	}

	run(oldMessage, newMessage) {
		const { client } = this;
		if (oldMessage.content === newMessage.content) return;
		client.emit('message', newMessage);
	}

	static createParams(msg) {
		const params = msg.content.split(' ').slice(1);
		return params;
	}

	static getCommand(msg, prefix) {
		const command = msg.content.split(' ')[0].slice(prefix.length).toLowerCase();
		return command;
	}
}

module.exports = MessageUpdateEvent;
