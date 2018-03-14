const { Command } = require('klasa');

module.exports = class PurgeCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'ban',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			aliases: [],
			permLevel: 4,
			usage: '<amount:integer>',
			botPerms: ['MANAGE_MESSAGES'],
			description: 'Clears and amount of messages (max 100!)'
		});
	}

	async run(msg, [amount]) {
		try {
			const deleted = await msg.channel.bulkDelete(amount);
			const message = await msg.send(`i've deleted ${deleted.size} Messages`);
			await message.delete(10000);
		} catch (error) {
			if (error.message === 'Unknown Message') throw error;
			const message = await msg.send('I may only delete Messages that are not older than 14 Days! thats is a Limit from Discord');
			await message.delete(10000);
		}
	}
};
