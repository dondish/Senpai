const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'playnext',
	description: 'add a song to the queue as #2 position.',
	examples: ['playnext Adele Hello', 'playnext https://www.youtube.com/watch?v=YQHsXMglC9A']
};

class PlayNextCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		const { me, client } = msg.guild;
		const { musicID } = msg.guild.music;
		let channel = msg.guild.channels.get(musicID);
		let { prefix } = await msg.guild.getConfig();
		const musicChannel = channel || msg.channel;
		if (!msg.guild.music.channelID) msg.guild.music.channelID = musicChannel.id;
		prefix = prefix ? prefix : client.config.prefix;
		if (!me.voiceChannelID) return msg.reply(`You must let me join a Voice Channel with ${prefix}join!`);
		const message = await msg.channel.send('trying to add your Song/Playlist at next position to the queue....');
		let link = params[0];
		if (!link) return message.edit('You must add a Link to add behind!');
		const player = this.client.lavalink.players.get(msg.guild.id);
		if (!player) return;
		try {
			let songs;
			if (this.isLink(params.join(' '))) {
				songs = await this.client.lavalink.resolveTrack(params.join(' '));
			} else {
				let arr = [];
				const searchResult = await this.client.lavalink.resolveTrack(`ytsearch: ${params.join(' ')}`);
				arr.push(searchResult[0]);
				songs = arr;
			}
			if (songs.length > 1) {
				await this._playlist(songs, message, { name: msg.member.displayName, url: msg.member.user.displayAvatarURL });
			} else {
				await this._song(songs[0], message, { name: msg.member.displayName, url: msg.member.user.displayAvatarURL });
			}
		} catch (error) {
			await message.edit(error.message);
		}
	}

	isLink(input) {
		return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g.test(input); // eslint-disable-line no-useless-escape
	}

	async _playlist(songs, message, requestor) {
		for (const song of songs) {
			song.user = requestor;
			message.guild.music.queueNext(song);
		}
		await message.edit(`**Queued** ${songs.length} songs.`);
	}

	async _song(song, message, requestor) {
		song.user = requestor;
		message.guild.music.queueNext(song);
		await message.edit(`**Queued:** ${song.info.title}.`);
	}
}

module.exports = PlayNextCommand;
