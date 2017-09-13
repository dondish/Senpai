const Events = require('../structures/new/Event.js');

class commandRun extends Events {
	constructor(client) {
		super(client);
		this.name = 'commandRun';
	}

	run(messageEvent, msg) {
		this.client.log.info(`[Command]   ${msg.author.tag}/${msg.author.id} (${msg.content})`);
	}
}

module.exports = commandRun;
