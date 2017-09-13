const Commands = require('../../structures/new/Command.js');
const { Collection } = require('discord.js');
const Kitsu = require('kitsu.js');
const kitsu = new Kitsu();
const info = {
	name: 'manga',
	description: 'search for a Manga on kitsu!',
	aliases: [],
	examples: ['manga ajin', 'manga attack on titan']
};

class MangaCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		function filter(message) {
			if (message.author.id !== msg.author.id) return false;
			if (message.content === '1' || message.content === '2' || message.content === '3' || message.content === '4' || message.content === '5') {
				return true;
			} else {
				return false;
			}
		}
		if (params.length < 1) return msg.reply('You must add a manga to search for');
		const message = await msg.channel.send('*fetching information from kitsu!*');
		try {
			const result = await kitsu.searchManga(params.join(' '));
			message.edit(`Okay i found 5 possible matches which do you want to see? (just write the first number, it will be canceled after 60 seconds)\n1: ${result[0].titles.enJp}\n2: ${result[1].titles.enJp}\n3: ${result[2].titles.enJp}\n4: ${result[3].titles.enJp}\n5: ${result[4].titles.enJp}`);
			const collected = await msg.channel.awaitMessages(filter, {
				max: 20,
				maxMatches: 1,
				time: 60000,
				errors: ['time']
			});
			const number = Number(collected.first().content) - 1;
			await msg.channel.send(`**Title EN/JP:** ${result[number].titles.enJp}\n**Type:** ${result[number].subType}\n**Start Date:** ${result[number].startDate}\n**End Date:** ${result[number].endDate || 'in Progress'}\n**PopularityRank:** ${result[number].popularityRank}\n**Link:** <https://kitsu.io/manga/${result[number].id}>\n**Synopsis:** ${result[number].synopsis}`);
		} catch (error) {
			if (error instanceof Collection) return msg.reply('command canceled due timer');
			await message.edit('I had a error while trying to fetch the data from Kitsu Sorry! did you spell the Manga name right?');
			await msg.react('❓');
		}
	}
}

module.exports = MangaCommand;
