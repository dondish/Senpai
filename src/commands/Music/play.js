const { Command } = require('klasa');

module.exports = class PlayCommand extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			aliases: ['add'],
			usage: '<song_or_playlist:str>',
			description: 'Add a Song/Playlist/Livestream from Youtube/Soundcloud/Twitch in the queue.'
		});
	}

	async run(msg, [...query]) {
		if (!msg.guild.music.channelID || !msg.guild.channels.has(msg.guild.music.channelID)) msg.guild.music.channelID = msg.channel.id;
		await msg.send('*adding your Song/Playlist to the queue....*');
		try {
			let songs;
			if (this.isLink(query.join(' '))) {
				songs = await this.client.customPieceStore.get('Lavalink').lavalink.resolveTrack(query.join(' '));
			} else {
				let arr = [];
				const searchResult = await this.client.customPieceStore.get('Lavalink').lavalink.resolveTrack(`ytsearch: ${query}`);
				arr.push(searchResult[0]);
				songs = arr;
			}
			if (songs.length > 1) {
				return this._playlist(songs, msg, { name: msg.member.displayName, url: msg.author.displayAvatarURL() });
			} else {
				return this._song(songs[0], msg, { name: msg.member.displayName, url: msg.author.displayAvatarURL() });
			}
		} catch (error) {
			return msg.send(error.message);
		}
	}

	_playlist(songs, message, requestor) {
		for (const song of songs) {
			song.user = requestor;
			message.guild.music.queue(song);
		}
		return message.send(`**Queued** ${songs.length} songs.`);
	}

	_song(song, message, requestor) {
		song.user = requestor;
		message.guild.music.queue(song);
		return message.send(`**Queued:** ${song.info.title}.`);
	}

	isLink(input) {
		return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g.test(input); // eslint-disable-line no-useless-escape
	}
};
