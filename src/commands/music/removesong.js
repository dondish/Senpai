const { Command } = require('klasa');

module.exports = class RemoveSongCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'removesong',
			enabled: true,
			runIn: ['text'],
			cooldown: 5,
			bucket: 1,
			permLevel: 0,
			usage: '<SongIndex:int>',
			aliases: ['deletesong'],
			description: 'Deletes are song from the queue.'
		});
	}

	run(msg, [index]) {
		const deletedSong = msg.guild.music.remove(index);
		return msg.send(`I've deleted the Song ${deletedSong.info.title} from the queue`);
	}
};
