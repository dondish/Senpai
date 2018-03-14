const { Event } = require('klasa');

module.exports = class MessageReactionRemoveEvent extends Event {
	constructor(...args) {
		super(...args, {
			name: 'messageReactionRemove',
			enabled: true,
			event: 'messageReactionRemove',
			once: false
		});
	}

	async run(messageReaction, user) {
		if (user.bot || messageReaction.emoji.name !== '⭐' || message.author.id === user.id || !guild) return;
		let { message, client, count: reactionCount } = messageReaction;
		const { guild } = message;
		const { starboard } = guild.configs.channels;
		const { count } = guild.configs.starboard;
		await messageReaction.fetchUsers();
		if (messageReaction.users.has(message.author.id)) reactionCount -= 1;
		const entry = client.gateways.starboard.cache.get(message.id);
		if (!entry) return;
		if (reactionCount < count) {
			await this.deleteStarboardMessage({ messageID: entry.id, starboard });
			client.gateways.starboard.deleteEntry(entry.id);
		} else {
			await this.client.events.get('messageReactionAdd').editStarboardMessage({ reactionCount, starboard, messageID: entry.id });
			await entry.update({ guild: message.guild, starCount: reactionCount });
		}
	}

	async deleteStarboardMessage(messageID, starboard) {
		let message = await starboard.messages.fetch(messageID);
		return message.delete();
	}
};
