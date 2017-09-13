const Events = require('../structures/new/Event.js');

class ReadyEvent extends Events {
	constructor(client) {
		super(client);
		this.name = 'ready';
	}

	run() {
		const { client } = this;
		client.log.info('-----------------------------------------------------------------------------');
		client.log.info(`Username:      ${client.user.username}`);
		client.log.info(`ID:            ${client.user.id}`);
		client.log.info(`Servers:       ${client.guilds.size}`);
		client.log.info(`Channels:      ${client.channels.size}`);
		client.log.info('-----------------------------------------------------------------------------');
		client.user.setGame(`${client.config.prefix}help || Version: ${client.version}`);
	}
}

module.exports = ReadyEvent;
