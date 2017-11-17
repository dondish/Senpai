const Events = require('../structures/new/Event.js');

class commandError extends Events {
	constructor(client) {
		super(client);
		this.name = 'commandError';
	}

	run(error, messageEvent, msg) {
		const { client } = this;
		if (error.message === 'Missing Permissions' || error.message === 'Missing access') return;
		client.log.error(`[Error]   ${error.name}: ${error.message}`);
		client.log.error(`          with this message ${msg.content}`);
		client.users.get(client.config.ownerID).send(`The error: "${error.name}:${error.message}" has occured; Go to logs for more info.`);
	}
}

module.exports = commandError;
