const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'purge',
	description: 'purges x amount of messages in this channel',
	aliases: ['prune', 'bulkdelete'],
	examples: ['purge 25', 'purge 75']
};

class bulkdeleteCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		const permissionLevel = await msg.member.getPermissionsLevel(this.client);
		if (permissionLevel >= 3) return msg.reply('You dont have permission to use this Command!');
		if (params.length < 1) return msg.reply('You must add a Number of the amount of to deleting messages!');
		if (!msg.deletable) return msg.reply('I have no rights to delete Messages!');
		let messagecount = parseInt(params.join(' '), 10);
		if (isNaN(messagecount)) return msg.reply('This Command only accept numbers!');
		if (messagecount <= 1) return msg.reply('You must purge more than 1 Message!');
		if (messagecount > 100) return msg.reply('You can only delete 100 Messages at the time!');
		try {
			const deleted = await msg.channel.bulkDelete(messagecount);
			const message = await msg.channel.send(`i've deleted ${deleted.size} Messages`);
			message.delete(10000);
		} catch (error) {
			const message = await msg.channel.send('I may only delete Messages that are not older than 14 Days! thats is a Limit from Discord');
			message.delete(10000);
		}
	}
}

module.exports = bulkdeleteCommand;
