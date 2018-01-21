const Events = require('../structures/new/Event.js');
const { RichEmbed } = require('discord.js');

class MessageReactionAddEvent extends Events {
	constructor(client) {
		super(client);
		this.name = 'messageReactionAdd';
	}

	async run(messageReaction, user) {
		const { client } = this;
		try {
			if (user.bot) return;
			if (messageReaction.emoji.name !== '⭐') return;
			const { message } = messageReaction;
			const { guild } = message;
			if (message.author.id === user.id) return;
			if (!guild) return;
			const { starboardChannel, starcount } = await guild.getConfig();
			const starboardChannelObj = message.guild.channels.get(starboardChannel);
			if (!starboardChannelObj) return;
			if (message.channel.id === starboardChannel.id) return;
			const starboardMessage = await guild.getStarboardMessage(message.id);
			if (starboardMessage) {
				await messageReaction.fetchUsers();
				let reactionCount = messageReaction.count;
				if (messageReaction.users.has(message.author.id)) reactionCount -= 1;
				await this.editStarboardMessage({ message, reactionCount, guild, starboardChannel });
			} else {
				await messageReaction.fetchUsers();
				let reactionCount = messageReaction.count;
				if (messageReaction.users.has(message.author.id)) reactionCount -= 1;
				if (reactionCount < starcount) return;
				await this.createStarboardMessage({ message, reactionCount, guild, starboardChannel });
			}
		} catch (error) {
			client.log.error(`MessageReactionAdd Event encountered this Error ${error.stack}`);
		}
	}

	async createStarboardMessage({ message, reactionCount, starboardChannel }) {
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
		const sent = await channel.send(embed);
		await message.guild.createStarboardMessage({ originalMessageID: message.id, starMessageID: sent.id, starCount: reactionCount, author: message.author.id });
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
			const matches = message.content.match(/(http:\/\/|https:\/\/)([a-z, ., /, \d, -, _]+)(\.(gif|jpg|jpeg|tiff|png))/gi);
			if (matches) embed.setImage(matches[0]);
		}
		if (message.attachments.size === 1) {
			if (/\.(gif|jpg|jpeg|tiff|png)$/i.test(message.attachments.first().filename)) embed.setImage(`${message.attachments.first().url}`);
		}
		const channel = message.guild.channels.get(starboardChannel);
		const messageObject = await message.guild.getStarboardMessage(message.id);
		const sentMessage = await channel.fetchMessage(messageObject.originalMessage);
		await message.guild.updateStarboardMessage({ originalMessageID: message.id, starMessageID: sentMessage.id, starCount: reactionCount });
		await sentMessage.edit({ embed });
	}
}

module.exports = MessageReactionAddEvent;
