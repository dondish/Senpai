const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'shuffle',
	description: 'shuffle the current queue',
	aliases: [],
	examples: ['shuffle']
};

class ShuffleCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const { voiceConnection } = msg.guild;
		let { queue, dispatcher } = msg.guild.music;
		const { musicLimited } = await msg.guild.getConfig();
		if (musicLimited) {
			const permissionLevel = await msg.member.getPermissionsLevel();
			if (permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!");
		}
		if (!voiceConnection) return msg.reply(`Im not in a Voice channel on this Server!`);
		if (!dispatcher) return msg.reply(`I don't play music at the moment!`);
		if (queue.length < 3) return msg.channel.send('You need atleast 3 songs in the queue to shuffle!');
		let newQueue = this.shuffle(queue);
		msg.guild.music.queue = newQueue;
		await msg.channel.send('successfully shuffled the queue!');
	}

	shuffle(queue) {
		let firstSong = queue.shift();
		let currentIndex = queue.length,
			randomIndex,
			temporaryValue;

		// While there remain elements to shuffle...
		while (currentIndex !== 0) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = queue[currentIndex];
			queue[currentIndex] = queue[randomIndex];
			queue[randomIndex] = temporaryValue;
		}

		// Add first song again to queue
		queue.unshift(firstSong);

		// Return queue
		return queue;
	}
}

module.exports = ShuffleCommand;
