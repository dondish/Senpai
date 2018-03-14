const Commands = require('../../structures/new/Command.js');
const { Collection } = require('discord.js');
const Kitsu = require('kitsu');
const kitsu = new Kitsu();
const info = {
	name: 'manga',
	description: 'search for a Manga on kitsu!',
	examples: ['manga ajin', 'manga attack on titan']
};

class MangaCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		function filter(message) {
			if (message.author.id !== msg.author.id) return false;
			return ['1', '2', '3', '4', '5'].includes(message.content);
		}
		if (params.length < 1) return msg.reply('You must add a manga to search for');
		let message = await msg.channel.send('*fetching information from kitsu!*');
		try {
			const { data } = await kitsu.fetch('manga', { filter: { text: params.join('-') } });
			message = await message.edit(`Okay i found 5 possible matches which do you want to see? (just write the first number, it will be canceled after 60 seconds)${this._constructTitles(data)}`);
			const collected = await msg.channel.awaitMessages(filter, {
				max: 20,
				maxMatches: 1,
				time: 60000,
				errors: ['time']
			});
			const returnMessage = collected.first();
			await returnMessage.delete();
			const index = Number(returnMessage.content) - 1;
			await message.edit(`**Title JP:** ${data[index].titles.en_jp}\n**Title English:** ${data[index].titles.en}\n**Type:** ${data[index].subtype}\n**Start Date:** ${data[index].startDate}\n**End Date:** ${data[index].endDate || 'in Progress'}\n**PopularityRank:** ${data[index].popularityRank}\n**Link:** <https://kitsu.io/manga/${data[index].id}>\n**Synopsis:** ${data[index].synopsis}`);
		} catch (error) {
			if (error instanceof Collection) return msg.reply('command canceled due timer');
			await message.edit('I had a error while trying to fetch the data from Kitsu Sorry! did you spell the Manga name right?');
			await msg.react('❓');
		}
	}
}

module.exports = MangaCommand;
