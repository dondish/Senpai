const Commands = require('../../structures/new/Command.js');
const Osu = require('node-osu');

const info = {
	name: 'osu',
	description: 'shows the stats of an osu! player or map',
	aliases: [],
	examples: ['osu user Username_here', 'osu map BeatmapID_here']
};

class OsuCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		const { client } = this;
		const osuApi = new Osu.Api(client.config.osuToken, {
			notFoundAsError: true,
			completeScores: false
		});
		if (!params[0]) return msg.reply('You must provide a first parameter!');
		if (!params[1]) return msg.reply('You must provide a second parameter');
		const Parameter1 = params[0].toLowerCase();
		if (Parameter1 !== 'user' && Parameter1 !== 'map') return msg.reply('your usage of my Osu! command is wrong. you can get some examples with the help command!');
		const message = await msg.channel.send('*Okay, im fetching the Data from Osu!*');
		if (Parameter1 === 'user') {
			try {
				const user = await osuApi.getUser({ u: params[1] });// eslint-disable-line id-length
				await message.edit(`**User:** ${user.name}\n\n**ID:** ${user.id}\n\n**Country:** ${user.country}\n\n**User Level:** ${user.level}\n\n**Accuracy:** ${user.accuracyFormatted}\n\n**Counts**: \n**SS:** ${user.counts.SS}\n**S:** ${user.counts.S}\n**A:** ${user.counts.A}\n\n`);
			} catch (error) {
				await message.edit('Something went wrong! did you Spell the Username right?');
			}
		} else {
			try {
				const beatmaps = await osuApi.getBeatmaps({ b: params[1] });
				const BeatmapObject = beatmaps[0];
				await message.edit(`**Title:** ${BeatmapObject.title}\n\n**Creator:** ${BeatmapObject.creator}\n\n**Genre:** ${BeatmapObject.genre}\n\n**Language:** ${BeatmapObject.language}\n\n**Status:** ${BeatmapObject.approvalStatus}`);
			} catch (error) {
				await message.edit('Something went wrong! is the map id right?');
			}
		}
	}
}

module.exports = OsuCommand;
