const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'join',
	description: 'joins your current voiceChannel',
	aliases: ['summon'],
	examples: ['join']
};

class JoinCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const { voiceChannel } = msg.member;
		let { me } = msg.guild;
		if (!voiceChannel) return msg.reply('You must be in a Voice channel to use this Command!');
		if (!voiceChannel.joinable) return msg.reply('I have no rights to join your Voice channel!');
		if (!voiceChannel.speakable) return msg.reply('I have no rights to speak in your Voice channel!');
		if (me.voiceChannelID) return msg.reply(`Im already in a Voice channel on this Server!`);
		try {
			this.client.ws.send({
				shard: this.client.shard.id,
				op: 4,
				d: { // eslint-disable-line id-length
					guild_id: msg.guild.id, // eslint-disable-line camelcase
					channel_id: voiceChannel.id, // eslint-disable-line camelcase
					self_mute: false, // eslint-disable-line camelcase
					self_deaf: false // eslint-disable-line camelcase
				}
			});
			await msg.channel.send('successfull joined your Voice Channel');
		} catch (error) {
			msg.channel.send('ooops! something went wrong while trying to connect to your Voicechannel please try to let me join again');
		}
	}
}

module.exports = JoinCommand;
