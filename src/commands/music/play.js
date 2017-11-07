const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'play',
	description: 'adds a Song/playlis from youtube to the queue and start the queue',
	aliases: ['add'],
	examples: ['play owl city fireflies', 'play https://www.youtube.com/watch?v=psuRGfAaju4', 'play Adele Hello']
};

class PlayCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params, prefix) {
		const { voiceConnection } = msg.guild;
		const guildConfig = await msg.guild.getConfig();
		let channel = msg.guild.channels.get(guildConfig.musicID);
		const musicChannel = channel || msg.channel;
		const isLimited = await msg.guild.getConfig();
		if (isLimited.musicLimited) {
			const permissionLevel = await msg.member.getPermissionsLevel();
			if (permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!");
		}
		if (voiceConnection === null) return msg.reply(`You must let me join a Voice Channel with ${prefix}join!`);
		const message = await msg.channel.send('trying to add your Song/Playlist to the queue....');
		let link = params[0];
		if (!link) return message.edit('You must add a Link to add behind!');
		if (link.startsWith('http')) {
			if (link.includes('watch') || link.includes('youtu.be')) {
				try {
					const result = await msg.guild.getMusic().handleSong(link, msg.author, true, musicChannel);
					message.edit(`**Queued:** ${result.title}`);
				} catch (error) {
					message.edit(`Could not add the Song/Playlist because this reason ${error.message}`);
				}
			} else if (link.includes('playlist')) {
				try {
					const result = await msg.guild.getMusic().handlePlaylist(link, msg.author, musicChannel);
					message.edit(result);
				} catch (error) {
					message.edit(`Could not add the Song/Playlist because this reason ${error.message}`);
				}
			} else {
				message.edit('Could not add the Song/Playlist because this link is not from Youtube!');
			}
		} else {
			try {
				const searchTerm = params.join(' ');
				const result = await msg.guild.getMusic().handleSong(searchTerm, msg.author, false, musicChannel);
				message.edit(`**Queued:** ${result.title}`);
			} catch (error) {
				message.edit(`Could not add the Song/Playlist because this reason ${error.message}`);
			}
		}
	}
}

module.exports = PlayCommand;
