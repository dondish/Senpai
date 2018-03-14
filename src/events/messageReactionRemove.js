const Events = require('../structures/new/Event.js');
const { RichEmbed } = require('discord.js');

class MessageReactionRemoveEvent extends Events {
	constructor(client) {
		super(client);
		this.name = 'messageReactionRemove';
	}

	async run(messageReaction, user) {
		if (user.bot) return;
		if (messageReaction.emoji.name !== '⭐') return;
		const { message } = messageReaction;
		const { guild } = message;
		if (message.author.id === user.id) return;
		if (!guild) return;
		await messageReaction.fetchUsers();
		let reactionCount = messageReaction.count;
		const { starboardChannel, starcount } = await guild.getConfig();
		if (messageReaction.users.has(message.author.id)) reactionCount -= 1;
		if (reactionCount < starcount) {
			await this.deleteStarboardMessage(message, starboardChannel);
		} else {
			await this.editStarboardMessage({ message, reactionCount, starboardChannel });
		}
	}

	async editStarboardMessage({ message, reactionCount, starboardChannel }) {
		const embed = new RichEmbed()
			.setAuthor(`${message.author.tag}`)
			.setThumbnail(message.author.displayAvatarURL)
			.addField(`ID:`, `${message.id}`, true)
			.addField('Channel', `${message.channel}`, true)
			.setTimestamp()
			.setFooter(`${reactionCount}⭐`)
			.setColor(0x80ff00);
		if (message.content) {
			embed.addField(`Message:`, `${message.content}`, true);
			const matches = message.content.match(/(http:\/\/|https:\/\/)([a-z, ., /, \d, -]+)(\.(gif|jpg|jpeg|tiff|png))/gi);
			if (matches) embed.setImage(matches[0]);
		}
		if (message.attachments.size === 1) {
			if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(message.attachments.first().filename)) embed.setImage(`${message.attachments.first().url}`);
		}
		const channel = message.guild.channels.get(starboardChannel);
		if (!channel) return;
		const messageObject = await message.guild.getStarboardMessage(message.id);
		const sentMessage = await channel.fetchMessage(messageObject.starMessageID);
		await sentMessage.edit({ embed });
		await message.guild.updateStarboardMessage({ originalMessageID: message.id, starMessageID: sentMessage.id, starcount: reactionCount });
	}

	async deleteStarboardMessage(message, starboardChannel) {
		const channel = message.guild.channels.get(starboardChannel);
		const messageObject = await message.guild.getStarboardMessage(message.id);
		if (!messageObject) return;
		const sentMessage = await channel.fetchMessage(messageObject.id);
		await message.guild.deleteStarboardMessage(message.id);
		await sentMessage.delete();
	}
}

module.exports = MessageReactionRemoveEvent;
