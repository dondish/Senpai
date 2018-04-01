const { Command } = require('klasa');

module.exports = class JoinCommand extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			aliases: ['summon'],
			description: 'Joins your current VoiceChannel'
		});
	}

	run(msg) {
		const { voiceChannel, guild } = msg.member;
		this.client.customPieceStore.get('Lavalink').lavalink.players.get(guild.id).join(voiceChannel.id, { deaf: false });
		return msg.send('successfull joined your Voice Channel');
	}
};
