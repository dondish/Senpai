const Events = require('../structures/new/Event.js');

class commandError extends Events {
	constructor(client) {
		super(client);
		this.name = 'commandError';
	}

	run(error, messageEvent, msg) {
		const { client } = this;
		client.log.info('   ');
		client.log.error(`[Error]   ${error.name}: ${error.message}`);
		client.log.error(`          with this message ${msg.content}`);
		client.log.info('   ');
		client.users.get(client.config.ownerID).send(`The Following Error occourd "${error.name}: ${error.message}" for more info look at the logs!`);
	}
}

module.exports = commandError;
