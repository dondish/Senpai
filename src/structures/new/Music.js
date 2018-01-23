const { googleAPIKey } = require('../../config/config.json');
const { MusicError } = require('./CustomErrors.js');
const yt = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(googleAPIKey);
const { RichEmbed } = require('discord.js');

class Music {
	constructor(Guild) {
		this.guild = Guild;
		this._queue = [];
		this.loop = false;
		this.playing = false;
		this.dispatcher = null;
	}

	playqueue(channel) {
		let { queue, guild, loop } = this;
		const { voiceConnection, client } = guild;
		let [CurrentSong] = queue;
		if (!voiceConnection || this.playing || queue.length === 0 || !CurrentSong) return;
		const { title, requestor, url, thumbnails } = CurrentSong;

		this.dispatcher = voiceConnection.playStream(yt(url, { audioonly: true }));

		this.dispatcher.on('start', () => {
			voiceConnection.player.streamingData.pausedTime = 0;
			this.playing = true;
			const embed = new RichEmbed()
				.setDescription(`[${title}](${url})`)
				.setAuthor(requestor.tag, requestor.displayAvatarURL)
				.setImage(thumbnails.maxres.url)
				.setColor('RANDOM');
			if (channel.permissionsFor(channel.guild.me).has('SEND_MESSAGES')) {
				channel.send(embed);
			}
		});

		this.dispatcher.on('error', error => {
			if (channel.permissionsFor(channel.guild.me).has('SEND_MESSAGES')) {
				channel.send('I had an error while trying to play the Current Song so i skipped it! if this happens more than 1 time please contact my DEV!');
			}
			queue.shift();
			client.log.error(`while trying to play a song this error occurred ${error.name}:${error.message}`);
			this.playing = false;
			this.dispatcher = null;
			return this.playqueue(channel);
		});

		this.dispatcher.on('end', () => setTimeout(() => {
			const shifted = queue.shift();
			if (loop) queue.push(shifted);
			this.playing = false;
			this.dispatcher = null;
			this.playqueue(channel);
		}, 200));
	}

	async handlePlaylist(link, requestedBy, channel, messageToEdit) {
		try {
			const playlist = await youtube.getPlaylist(link);
			const songs = await playlist.getVideos();
			for (const song of songs) this.queue.push(new Song(song, requestedBy));
			this.playqueue(channel);
			return `${songs.length} Songs were added.`;
		} catch (error) {
			throw new MusicError(error.message, messageToEdit);
		}
	}

	async handleSong(input, requestedBy, isUrl, channel, messageToEdit) {
		if (isUrl) {
			const Song = await this.getSongByUrl(input, requestedBy, messageToEdit);
			this.queue.push(Song);
			this.playqueue(channel);
			return Song;
		} else {
			const Song = await this.getSongByName(input, requestedBy, messageToEdit);
			this.queue.push(Song);
			this.playqueue(channel);
			return Song;
		}
	}

	async handleSongAsNext(input, requestedBy, isUrl, channel, messageToEdit) {
		if (isUrl) {
			const Song = await this.getSongByUrl(input, requestedBy, messageToEdit);
			this.queue.splice(1, 0, Song);
			this.playqueue(channel);
			return Song;
		} else {
			const Song = await this.getSongByName(input, requestedBy, messageToEdit);
			this.queue.splice(1, 0, Song);
			this.playqueue(channel);
			return Song;
		}
	}

	async getSongByUrl(url, requestedBy, messageToEdit) {
		const id = /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/g.exec(url);
		if (!id) throw new MusicError('this Link isn\'s a Youtube Video', messageToEdit);
		const result = await youtube.getVideoByID(id[1]);
		if (!result) throw new MusicError('Song Unaviable', messageToEdit);
		const song = new Song(result, requestedBy);
		if (song.durationSeconds > 1800) throw new MusicError('Song is too long! the maximun limit is 30 minutes', messageToEdit);
		return song;
	}

	async getSongByName(name, requestedBy, messageToEdit) {
		const results = await youtube.searchVideos(name);
		if (!results[0]) throw new MusicError('i found no song with that name. Please use a link instead!', messageToEdit);
		let [result] = results;
		return new Song(result, requestedBy);
	}

	set queue(input) {
		this._queue = input;
	}

	get queue() {
		return this._queue;
	}
}

class Song extends YouTube.Video {
	constructor(song, requestedBy) {
		super(youtube, song.raw);
		this.requestor = requestedBy;
	}
}

module.exports = Music;
