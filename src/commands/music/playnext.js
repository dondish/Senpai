const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'playnext',
	description: 'add a song to the queue as #2 position. Important! this Command takes no playlists',
	examples: ['playnext Adele Hello', 'playnext https://www.youtube.com/watch?v=YQHsXMglC9A']
};

class PlayNextCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		const { voiceConnection, client } = msg.guild;
		const { musicID } = msg.guild.music;
		let channel = msg.guild.channels.get(musicID);
		const musicChannel = channel || msg.channel;
		let { musicLimited, prefix } = await msg.guild.getConfig();
		prefix = prefix ? prefix : client.config.prefix;
		if (musicLimited) {
			const permissionLevel = await msg.member.getPermissionsLevel();
			if (permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to use this Command!");
		}
		if (!voiceConnection) return msg.reply(`You must let me join a Voice Channel with ${prefix}join!`);
		const message = await msg.channel.send('trying to add your Song at next position to the queue....');
		let link = params[0];
		if (!link) return message.edit('You must add a Link to add behind!');
		if (link.startsWith('http')) {
			if (link.includes('watch') || link.includes('youtu.be')) {
				const result = await msg.guild.music.handleSongAsNext(link, msg.author, true, musicChannel, message);
				message.edit(`**Queued:** ${result.title}`);
			} else if (link.includes('playlist')) {
				return message.edit("this command don't accept Playlists!");
			}
		} else {
			const searchTerm = params.join(' ');
			const result = await msg.guild.music.handleSongAsNext(searchTerm, msg.author, false, musicChannel, message);
			message.edit(`**Queued:** ${result.title}`);
		}
	}
}

module.exports = PlayNextCommand;
