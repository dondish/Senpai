const Events = require('../structures/new/Event.js');
const { post } = require('snekfetch');

class LeaveEvent extends Events {
	constructor(client) {
		super(client);
		this.name = 'guildDelete';
	}

	async run(guild) {
		const size = await guild.client.shard.fetchClientValues('guilds.size');
		const guildsizes = size.reduce((prev, val) => prev + val, 0);
		await post(`https://discordbots.org/api/bots/${guild.client.user.id}/stats`)
			.set('Authorization', this.client.config.dBotsToken)
			.send({ server_count: guildsizes }); // eslint-disable-line camelcase
		await post(`https://bots.discord.pw/api/bots/${guild.client.user.id}/stats`)
			.set('Authorization', this.client.config.discordBotsToken)
			.send({ server_count: guildsizes }); // eslint-disable-line camelcase
		this.client.log.info(`${guild.client.user.username} left the Guild ${guild.name} size is now ${guildsizes}`);
	}
}

module.exports = LeaveEvent;
