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
			const serverConfig = await guild.getConfig();
			const starboardChannel = message.guild.channels.get(serverConfig.starboardID);
			if (!starboardChannel) return;
			if (message.channel.id === starboardChannel.id) return;
			const starboardMessages = await guild.getStarboardMessages();
			if (starboardMessages[message.id]) {
				await messageReaction.fetchUsers();
				let reactionCount = messageReaction.count;
				if (messageReaction.users.has(message.author.id)) reactionCount -= 1;
				await this.editStarboardMessage({ message, reactionCount, guild, serverConfig });
			} else {
				let neededReactions = 1;
				if (serverConfig.starboardNeededReactions) {
					neededReactions = serverConfig.starboardNeededReactions;
				}
				await messageReaction.fetchUsers();
				let reactionCount = messageReaction.count;
				if (messageReaction.users.has(message.author.id)) reactionCount -= 1;
				if (reactionCount < neededReactions) return;
				await this.createStarboardMessage({ message, reactionCount, guild, serverConfig });
			}
		} catch (error) {
			client.log.error(`MessageReactionAdd Event encountered this Error ${error.name}: ${error.message}`);
		}
	}

	async createStarboardMessage({ message, reactionCount, serverConfig }) {
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
		const channel = message.guild.channels.get(serverConfig.starboardID);
		const sent = await channel.send({ embed });
		await message.guild.updateStarboardMessage({ originalMessageID: message.id, starMessageID: sent.id, starcount: reactionCount });
	}

	async editStarboardMessage({ message, reactionCount, serverConfig }) {
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
		const channel = message.guild.channels.get(serverConfig.starboardID);
		const messageObject = await message.guild.resolveStarboardMessage(message.id);
		const sentMessage = await channel.fetchMessage(messageObject.starMessageID);
		await message.guild.updateStarboardMessage({ originalMessageID: message.id, starMessageID: sentMessage.id, starcount: reactionCount });
		await sentMessage.edit({ embed });
	}
}

module.exports = MessageReactionAddEvent;
