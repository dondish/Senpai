const Events = require('../structures/new/Event.js');

class ErrorEvent extends Events {
	constructor(client) {
		super(client);
		this.name = 'error';
	}

	run(error) {
		this.client.log.error(error);
	}
}

module.exports = ErrorEvent;
