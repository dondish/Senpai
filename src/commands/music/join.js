const { Command } = require('klasa');

module.exports = class JoinCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'join',
			enabled: true,
			runIn: ['text'],
			cooldown: 5,
			bucket: 1,
			aliases: ['summon'],
			permLevel: 0,
			description: 'Joins your current VoiceChannel'
		});
	}

	run(msg) {
		const { voiceChannel } = msg.member;
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
		return msg.send('successfull joined your Voice Channel');
	}
};
