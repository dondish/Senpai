const { Command } = require('klasa');

module.exports = class LeaveCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'leave',
			enabled: true,
			runIn: ['text'],
			cooldown: 5,
			bucket: 1,
			permLevel: 0,
			description: 'Leave the VoiceChannel im currently connected to and removes the queue.'
		});
	}

	run(msg) {
		msg.guild.music.reset();
		this.client.ws.send({
			shard: this.client.shard.id,
			op: 4,
			d: { // eslint-disable-line id-length
				guild_id: msg.guild.id, // eslint-disable-line camelcase
				channel_id: null, // eslint-disable-line camelcase
				self_mute: false, // eslint-disable-line camelcase
				self_deaf: false // eslint-disable-line camelcase
			}
		});
		return msg.send('bye bye :wave:');
	}
};
