const Commands = require('../../structures/new/Command.js');
const { RichEmbed, Collection } = require('discord.js');
const info = {
	name: 'poll',
	description: 'creates a Poll where you can react to vote and the winner will be announce after a stated time ( , is the seperator)',
	aliases: ['vote'],
	examples: ['poll 25m Go eat Pizza, Go eat Pasta, Go eat Burger']
};

class PollCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
		this.emojiValues = {
			1: '1⃣',
			2: '2⃣',
			3: '3⃣',
			4: '4⃣',
			5: '5⃣',
			6: '6⃣',
			7: '7⃣',
			8: '8⃣',
			9: '9⃣',
			10: '🔟'
		};
	}

	createCollection(array, emojiValues) {
		const iterable = [];
		for (let i = 0; i < array.length; i++) {
			const key = i + 1;
			iterable.push([key, { emoji: emojiValues[key], option: array[i] }]);
		}
		return new Collection(iterable);
	}

	async run(msg, params) {
		const { validateTime, parseTime, emojiValues, clean, createCollection, getWinnerReactions } = this;
		if (!params) return msg.channel.send('you need to supply a run out time aswell as atleast 2 options to choose!');
		let [time, ...options] = params;
		options = clean(options.join(' ')).split(', ');
		if (options.length < 2) return msg.channel.send('you need to supply atleast 2 options to to choose!');
		if (options.length > 10) return msg.channel.send('you can only set a max of 10 options!');
		if (!validateTime(time)) return msg.reply('seems like your Time is invalid! please try again');
		const timeObject = parseTime(time);
		time = timeObject.startDate.getTime() - Date.now();
		const collection = createCollection(options, emojiValues);

		const embed = new RichEmbed()
			.setAuthor(msg.member.displayName, msg.author.displayAvatarURL)
			.setTitle('Choose!')
			.setColor('BLUE')
			.addField('Options', collection.map(object => `${object.emoji} => ${object.option}`).join('\n'))
			.setFooter(`this poll will last ${this.format(time / 1000)}`);

		const sent = await msg.channel.send(embed);

		sent.awaitReactions((reaction, user) => {
			if (!collection.exists('emoji', reaction.emoji.name) || user.bot) return false;
			return true;
		}, {
			time,
			errors: ['time']
		}).catch(async reactions => {
			reactions = reactions.sort((a, b) => a.count - b.count);
			const firstReaction = reactions.first();
			if (reactions.size === 0) {
				const editEmbed = new RichEmbed()
					.setAuthor(msg.member.displayName, msg.author.displayAvatarURL)
					.setColor('RED')
					.setTitle('Poll Closed!')
					.addField('Result:', `Nobody did vote so no option won!`);
				return sent.edit({ embed: editEmbed });
			}
			if (reactions.some(reaction => {
				if (reaction.emoji.name === firstReaction.emoji.name) return false;
				if (reaction.count === firstReaction.count) return true;
				return false;
			})) {
				const editEmbed = new RichEmbed()
					.setAuthor(msg.member.displayName, msg.author.displayAvatarURL)
					.setColor('RED')
					.setTitle('Poll Closed!')
					.addField('Result:', `Mutiple options won.\nThe winners are:\n${getWinnerReactions(reactions, collection).map(val => val.option).join('\n')}`);
				await sent.edit({ embed: editEmbed });
			} else {
				const editEmbed = new RichEmbed()
					.setAuthor(msg.member.displayName, msg.author.displayAvatarURL)
					.setColor('RED')
					.setTitle('Poll Closed!')
					.addField('Result:', `The Winner is\n${collection.find('emoji', reactions.first().emoji.name).option}`);
				await sent.edit({ embed: editEmbed });
			}
		});
		const emojis = collection.map(object => object.emoji);
		for (let i = 0; i < emojis.length; i++) {
			await sent.react(emojis[i]); // eslint-disable-line no-await-in-loop
		}
	}

	getWinnerReactions(reactions, optionCollection) {
		const winnerEmojis = reactions.filter(reaction => reaction.count === reactions.first().count).map(reaction => reaction.emoji.name);
		return optionCollection.filter(val => winnerEmojis.includes(val.emoji));
	}
}

module.exports = PollCommand;
