const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'leave',
	description: 'disconnect from voiceChannel im currently in!',
	aliases: [],
	examples: ['disconnect']
};

class LeaveCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const { me } = msg.guild;
		if (!me.voiceChannelID) return msg.reply(`Im not in a Voice channel on this Server!`);
		if (msg.guild.music._queue.length > 0) msg.guild.music._queue.length = 0;
		if (msg.guild.music.loop) msg.guild.music.loop = false;
		if (msg.guild.music.playing) msg.guild.music.stop();
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
		await msg.channel.send('bye bye :wave:');
	}
}

module.exports = LeaveCommand;
