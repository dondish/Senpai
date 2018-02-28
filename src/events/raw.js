const Events = require('../structures/new/Event.js');

class RawEvent extends Events {
	constructor(client) {
		super(client);
		this.name = 'raw';
		this.methods = {
			MESSAGE_REACTION_ADD: 'messageReactionAdd',
			MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
			VOICE_STATE_UPDATE: 'voiceStateUpdate',
			VOICE_SERVER_UPDATE: 'voiceServerUpdate'
		};
		this.keys = Object.keys(this.methods);
	}

	async run(event) {
		const { d: data, t: type } = event; // eslint-disable-line id-length
		if (!this.keys.includes(type)) return;
		await this[this.methods[type]](data);
	}

	async messageReactionAdd(data) {
		const { client } = this;
		const channel = client.channels.get(data.channel_id);

		if (channel.messages.has(data.message_id)) return;

		const user = client.users.get(data.user_id);
		const message = await channel.fetchMessage(data.message_id);
		const emojiKey = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
		const reaction = message.reactions.get(emojiKey);

		client.emit('messageReactionAdd', reaction, user);
	}

	async messageReactionRemove(data) {
		const { client } = this;
		const channel = client.channels.get(data.channel_id);

		if (channel.messages.has(data.message_id)) return;

		const user = client.users.get(data.user_id);
		const message = await channel.fetchMessage(data.message_id);
		const reaction = message.reactions.get(data.emoji.id || data.emoji.name);

		client.emit('messageReactionRemove', reaction, user);
	}

	voiceStateUpdate(data) {
		return this.client.lavalink.voiceStateUpdate(data);
	}

	voiceServerUpdate(data) {
		return this.client.lavalink.voiceServerUpdate(data);
	}
}

module.exports = RawEvent;
