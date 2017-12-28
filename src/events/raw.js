const Events = require('../structures/new/Event.js');

class RawEvent extends Events {
	constructor(client) {
		super(client);
		this.name = 'raw';
	}

	async run(event) {
		if (event.t !== 'MESSAGE_REACTION_ADD' && event.t !== 'MESSAGE_REACTION_REMOVE') return;
		const { d: data, t: type } = event; // eslint-disable-line id-length
		try {
			if (type === 'MESSAGE_REACTION_ADD') {
				await this.reactionAdd(data);
			} else if (type === 'MESSAGE_REACTION_REMOVE') {
				await this.reactionRemove(data);
			}
		} catch (error) {
			this.client.log.error(`Raw Event encountered this Error ${error.name}: ${error.message}`);
		}
	}

	async reactionAdd(data) {
		const { client } = this;
		const channel = client.channels.get(data.channel_id);

		if (channel.messages.has(data.message_id)) return;

		const user = client.users.get(data.user_id);
		const message = await channel.fetchMessage(data.message_id);
		const reaction = message.reactions.get(data.emoji.id || data.emoji.name);

		client.emit('messageReactionAdd', reaction, user);
	}

	async reactionRemove(data) {
		const { client } = this;
		const channel = client.channels.get(data.channel_id);

		if (channel.messages.has(data.message_id)) return;

		const user = client.users.get(data.user_id);
		const message = await channel.fetchMessage(data.message_id);
		const reaction = message.reactions.get(data.emoji.id || data.emoji.name);

		client.emit('messageReactionRemove', reaction, user);
	}
}

module.exports = RawEvent;
