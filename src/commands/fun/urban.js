const { Command } = require('klasa');
const { random } = require('relevant-urban');
const { MessageEmbed } = require('discord.js');

module.exports = class UrbanCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'urban',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			permLevel: 0,
			usage: '<phrase:str>',
			botPerms: ['EMBED_MESSAGE'],
			description: 'Search for a word on the urban dictonary'
		});
	}

	async run(msg, [...query]) {
		try {
			const { author, word, definition, example, thumbsUp, thumbsDown } = await random(query);
			const embed = new MessageEmbed()
				.setAuthor(author)
				.setTitle(word)
				.setDescription(definition)
				.addField('Example:', example)
				.setFooter(`${thumbsUp}👍 | ${thumbsDown}👎`)
				.setColor('RANDOM');
			return msg.sendEmbed(embed);
		} catch (error) {
			return msg.send('Sorry but i didn\'t find this phrase on the urban dictonary!');
		}
	}
};
