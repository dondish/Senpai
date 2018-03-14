const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const info = {
	name: 'quote',
	description: 'this will quote or generate a quoted message for you',
	examples: ['quote -id MESSAGE_ID', 'quote @author MESSAGE_CONTENT_HERE']
};

class VoteCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		if (params.length < 2) return msg.reply('You need atleast 2 parameter!');
		if (msg.mentions.members.size === 0) {
			if (params[0].toLowerCase() !== '-id') return msg.reply('the first parameter must be `-id` or a mention!');
			try {
				const message = await msg.channel.fetchMessage(params[1]);
				const embed = new RichEmbed()
					.setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL}`)
					.addField(`ID:`, `${params[1]}`)
					.addField(`Message:`, `${message.content}`)
					.setTimestamp(message.createdAt)
					.setColor(0x80ff00);
				await msg.channel.send(embed);
			} catch (error) {
				await msg.channel.send('seems like your provided Message ID is wrong or not from this channel!');
			}
		} else {
			const content = params.slice(1).join(' ');
			const embed = new RichEmbed()
				.setAuthor(`${msg.mentions.users.first().username}`, `${msg.mentions.users.first().displayAvatarURL}`)
				.addField(`Message:`, `${content}`)
				.setTimestamp()
				.setColor(0x80ff00);
			await msg.channel.send(embed);
		}
	}
}

module.exports = VoteCommand;
