const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const info = {
	name: 'queue',
	description: 'shows the music queue of this server',
	aliases: ['songs', 'playlist', 'list'],
	examples: ['queue']
};

class QueueCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	run(msg) {
		const { queue } = msg.guild.getMusic();
		if (queue.length < 1) return msg.reply('there are no songs currently in queue!');
		let totalTimeInSec = 0;

		const songsLength = queue.map(Song => Number(Song.length));

		for (let index = 0; index < songsLength.length; index++) {
			totalTimeInSec += songsLength[index];
		}

		const time = this.format(Math.floor(totalTimeInSec));
		const songs = queue.map(Song => `${Song.title} requested by ${Song.requestedBy.tag}`);
		const embed = this.constructRichEmbed(songs, msg, time);
		msg.channel.send({ embed });
	}

	constructRichEmbed(songArray, msg, time) {
		const first = songArray.shift();
		const embed = new RichEmbed()
			.setAuthor(msg.author.username, msg.author.displayAvatarURL)
			.addField('Currently Playing', `\`\`\`\n${first}\`\`\``)
			.addField('Queue', `\`\`\`${songArray.join('\n')}\`\`\``)
			.setColor('RANDOM');
		if (songArray.length > 15) {
			let before = songArray.length;
			songArray.length = 15;
			embed.setFooter(`and ${before - 15} songs more... | total length: ${time}`);
		} else {
			embed.setFooter(`total length: ${time}`);
		}
		return embed;
	}
}

module.exports = QueueCommand;
