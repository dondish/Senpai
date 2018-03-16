const { Command } = require('klasa');

module.exports = class QueueCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'queue',
			enabled: true,
			runIn: ['text'],
			cooldown: 5,
			bucket: 1,
			aliases: ['playlist'],
			permLevel: 0,
			description: 'Shows the currently Song Queue'
		});
	}

	run(msg) {
		const { _queue } = msg.guild.music;
		let time = _queue.map(song => song.info.isStream ? 0 : song.info.length).reduce((a, b) => a + b);
		time = this.format(time / 1000);
		const songs = _queue.map(song => `${song.info.title}\nRequested by ${song.user.name}`);
		const embed = this.constructRichEmbed(songs, msg, time);
		return msg.send(embed);
	}

	constructRichEmbed(songArray, msg, time) {
		const first = songArray.shift();
		const embed = new this.client.methods.Embed()
			.setAuthor(msg.member.displayName, msg.author.displayAvatarURL())
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
};
