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
		const { musicChannel: musicID } = await msg.guild.getConfig();
		let channel = msg.guild.channels.get(musicID);
		const musicChannel = channel || msg.channel;
		const { musicLimited } = await msg.guild.getConfig();
		if (musicLimited) {
			const permissionLevel = await msg.member.getPermissionsLevel();
			if (permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!");
		}
		if (!voiceConnection) return msg.reply(`You must let me join a Voice Channel with ${prefix}join!`);
		const message = await msg.channel.send('trying to add your Song/Playlist to the queue....');
		let link = params[0];
		if (!link) return message.edit('You must add a Link to add behind!');
		if (link.startsWith('http')) {
			if (link.includes('watch') || link.includes('youtu.be')) {
				const result = await msg.guild.music.handleSong(link, msg.author, true, musicChannel, message);
				await message.edit(`**Queued:** ${result.title}`);
			} else if (link.includes('playlist')) {
				const result = await msg.guild.music.handlePlaylist(link, msg.author, musicChannel, message);
				await message.edit(result);
			} else {
				await message.edit('Could not add the Song/Playlist because this link is not from Youtube!');
			}
		} else {
			const searchTerm = params.join(' ');
			const result = await msg.guild.music.handleSong(searchTerm, msg.author, false, musicChannel, message);
			await message.edit(`**Queued:** ${result.title}`);
		}
	}
}

module.exports = PlayCommand;
