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
}

module.exports = MessageUpdateEvent;
