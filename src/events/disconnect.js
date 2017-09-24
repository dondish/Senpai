const Events = require('../structures/new/Event.js');

class DisconnectEvent extends Events {
	constructor(client) {
		super(client);
		this.name = 'disconnect';
	}

	run(CloseEvent) {
		this.client.log.debug(`disconnect due Reason ${CloseEvent.reason}`);
		process.exit();
	}
}

module.exports = DisconnectEvent;
