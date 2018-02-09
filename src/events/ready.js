const Events = require('../structures/new/Event.js');
const Timer = require('../structures/new/Timer.js');

class ReadyEvent extends Events {
	constructor(client) {
		super(client);
		this.name = 'ready';
	}

	async run() {
		const { client } = this;
		client.log.info('-----------------------------------------------------------------------------');
		client.log.info(`Username:      ${client.user.username}`);
		client.log.info(`ID:            ${client.user.id}`);
		client.log.info(`Servers:       ${client.guilds.size}`);
		client.log.info(`Channels:      ${client.channels.size}`);
		client.log.info('-----------------------------------------------------------------------------');
		client.user.setActivity(`${client.config.prefix}help || Version: ${client.version}`);
		const Timers = new Timer(client);
		await Timers.init();
		const promises = [];
		for (const guild of client.guilds.values()) {
			if (!guild.me) promises.push(guild.fetchMember(client.user));
		}
		await Promise.all(promises);
	}
}

module.exports = ReadyEvent;
