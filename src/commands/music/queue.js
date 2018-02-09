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
		const { queue } = msg.guild.music;
		if (!queue || queue.length < 1) return msg.reply('there are no songs currently in queue!');

		let time = queue.map(song => song.durationSeconds).reduce((a, b) => a + b);

		time = this.format(time);
		const songs = queue.map(Song => `${Song.title}\nRequested by ${Song.requestor.tag}`);
		const embed = this.constructRichEmbed(songs, msg, time);
		msg.channel.send(embed);
	}

	constructRichEmbed(songArray, msg, time) {
		const first = songArray.shift();
		const embed = new RichEmbed()
			.setAuthor(msg.author.username, msg.author.displayAvatarURL)
			.addField('Currently Playing', `\`\`\`\n${first}\`\`\``)
			.setColor('RANDOM');
		if (songArray.length > 5) {
			let before = songArray.length;
			songArray.length = 5;
			embed.setFooter(`and ${before - songArray.length} songs more... | total queue length: ${time}`);
		} else {
			embed.setFooter(`total queue length: ${time}`);
		}
		for (const index in songArray) {
			embed.addField(`#${Number(index) + 1}`, `\`\`\`\n${songArray[index]}\`\`\``);
		}
		return embed;
	}
}

module.exports = QueueCommand;
