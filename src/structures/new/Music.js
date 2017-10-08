const { googleAPIKey } = require('../../config/config.json');
const promiseReflect = require('promise-reflect');
const yt = require('ytdl-core');
const YouTube = require('youtube-node');
const youtube = new YouTube();
youtube.setKey(googleAPIKey);
const ypi = require('youtube-playlist-info');
const search = require('youtube-search');
const { RichEmbed } = require('discord.js');
const searchOptions = {
	maxResults: 10,
	key: googleAPIKey
};

class Music {
	constructor(Guild) {
		this.guild = Guild;
		this.queue = [];
		this.loop = false;
		this.playing = false;
		this.dispatcher = null;
	}

	playqueue(channel) {
		const { voiceConnection } = channel.guild;
		let { queue } = this;
		let [CurrentSong] = queue;
		if (!voiceConnection || this.playing || queue.length === 0) return;
		const { title, requestedBy, link, picture } = CurrentSong;
		this.dispatcher = voiceConnection.playStream(yt(link, { filter: 'audioonly' }));
		this.dispatcher.on('start', () => {
			voiceConnection.player.streamingData.pausedTime = 0;
			this.playing = true;
			const embed = new RichEmbed()
				.setDescription(`[${title}](${link})`)
				.setAuthor(requestedBy.tag, requestedBy.displayAvatarURL);
			if (picture) {
				embed.setImage(picture);
			}
			embed.setColor('RANDOM');
			channel.send({ embed });
		}
		);
		this.dispatcher.on('error', error => {
			channel.send('I had an error while trying to play the Current Song so i skipped it! if this happens more than 1 time please contact my DEV!');
			queue.shift();
			this.guild.client.log.error(`while trying to play a song this error occourd ${error.name}:${error.message}`);
			this.playing = false;
			return this.playqueue(channel);
		}
		);
		this.dispatcher.on('end', () => {
			const shifted = queue.shift();
			if (this.loop) queue.push(shifted);
			this.playing = false;
			this.dispatcher = null;
			this.playqueue(channel);
		});
	}

	handlePlaylist(link, requestedBy, channel) {
		return new Promise(async (resolve, reject) => {
			try {
				const playlist = await this.getPlaylist(link);
				const promises = [];
				for (const song of playlist) {
					const url = `https://www.youtube.com/watch?v=${song.resourceId.videoId}`;
					promises.push(this.getSongByUrl(url, requestedBy));
				}
				Promise.all(promises.map(promiseReflect)).then(values => {
					let resolved = values.filter(value => value.status === 'resolved');
					let rejected = values.filter(value => value.status === 'rejected');
					resolved.map(song => this.queue.push(song.data));
					resolve(`${resolved.length} Songs were added, ${rejected.length} could not be added due length, Copyright issues or it is Private`);
					this.playqueue(channel);
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	handleSong(input, requestedBy, isUrl, channel) {
		return new Promise(async (resolve, reject) => {
			if (isUrl) {
				try {
					const Song = await this.getSongByUrl(input, requestedBy);
					this.queue.push(Song);
					this.playqueue(channel);
					resolve(Song);
				} catch (error) {
					reject(error);
				}
			} else {
				try {
					const Song = await this.getSongByName(input, requestedBy);
					this.queue.push(Song);
					this.playqueue(channel);
					resolve(Song);
				} catch (error) {
					reject(error);
				}
			}
		});
	}

	handleSongAsNext(input, requestedBy, isUrl, channel) {
		return new Promise(async (resolve, reject) => {
			if (isUrl) {
				try {
					const Song = await this.getSongByUrl(input, requestedBy);
					this.queue.splice(1, 0, Song);
					this.playqueue(channel);
					resolve(Song);
				} catch (error) {
					reject(error);
				}
			} else {
				try {
					const Song = await this.getSongByName(input, requestedBy);
					this.queue.splice(1, 0, Song);
					this.playqueue(channel);
					resolve(Song);
				} catch (error) {
					reject(error);
				}
			}
		});
	}

	getSongByUrl(url, requestedBy) {
		return new Promise((resolve, reject) => {
			try {
				const id = /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/g.exec(url);
				if (!id) throw new Error('this Link isn\'s a Youtube Video');
				youtube.getById(id[1], (err, result) => {
					if (err) return reject(err);
					if (!result.items[0]) return reject(new Error('Song Unaviable'));
					const Song = new SongInfo(result.items[0], requestedBy);
					if (Song.length > 1800) return reject(new Error('Song is too long! the maximun limit is 30 minutes'));
					resolve(Song);
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	getSongByName(name, requestedBy) {
		return new Promise((resolve, reject) => {
			try {
				search(name, searchOptions, async (err, result) => {
					try {
						if (err) throw err;
						if (!result || !result[0]) throw new Error('searching for that song failed');
						let [song] = result;
						let index = 0;
						while (song.kind !== 'youtube#video') {
							index += 1;
							song = result[index];
						}
						const songInfo = await this.getSongByUrl(song.link, requestedBy);
						resolve(songInfo);
					} catch (error) {
						reject(error);
					}
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	getPlaylist(url) {
		return new Promise((resolve, reject) => {
			try {
				const id = /[&?]list=([a-z0-9_-]+)/i.exec(url);
				if (!id) throw new Error('this Link isn\'s a Youtube Playlist');
				ypi.playlistInfo(googleAPIKey, id[1], playlistItems => {
					if (!playlistItems) throw new Error('Invalid playlist');
					resolve(playlistItems);
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	overwriteQueue(queue) {
		this.queue = queue;
	}
}

class SongInfo {
	constructor(info, requestedBy) {
		this.id = info.id;
		this.link = `https://www.youtube.com/watch?v=${this.id}`;
		this.title = info.snippet.title;
		this.length = this.parseTime(info.contentDetails.duration);
		this.default = info.snippet.thumbnails.default ? info.snippet.thumbnails.default.url : null;
		this.medium = info.snippet.thumbnails.medium ? info.snippet.thumbnails.medium.url : null;
		this.high = info.snippet.thumbnails.high ? info.snippet.thumbnails.high.url : null;
		this.standard = info.snippet.thumbnails.standard ? info.snippet.thumbnails.standard.url : null;
		this.picture = this.standard || this.high || this.medium || this.default;
		this.requestedBy = requestedBy;
	}

	parseTime(time) {
		if (!time) return null;
		const match = time.match(/P(\d+M)?(\d+W)?(\d+D)?T(\d+H)?(\d+M)?(\d+S)?/);

		const Month = parseInt(match[1]) || 0,
			Weeks = parseInt(match[2]) || 0,
			Days = parseInt(match[3]) || 0,
			Hours = parseInt(match[4]) || 0,
			minutes = parseInt(match[5]) || 0,
			Seconds = parseInt(match[6]) || 0;

		return Month * 2629744 + Weeks * 604800 + Days * 86400 + Hours * 3600 + minutes * 60 + Seconds; // eslint-disable-line no-mixed-operators
	}
}

module.exports = Music;
