const Events = require('../structures/new/Event.js');
const { MusicError, DatabaseError, UsageError } = require('../structures/new/CustomErrors');

class commandError extends Events {
	constructor(client) {
		super(client);
		this.name = 'commandError';
	}

	async run(error, messageEvent, msg) {
		const { client } = this;
		if (error instanceof MusicError) return error.msg.edit(`Could not add the Song/Playlist because this reason: \`${error.message}\``);
		if (error instanceof DatabaseError) return msg.channel.send(`Could not execute this command because of this reason: \`${error.message}\``);
		if (error instanceof UsageError) return msg.channel.send(error.message);
		if (error.message === 'Missing Permissions' || error.message === 'Missing Access' || error.message === 'Unknown Message') return;
		const { supportServerLink } = client.config;
		const { ownerID } = client.constants;
		const owner = client.users.get(ownerID);
		msg.reply(`An error occurred while running the command: \`${error.name}: ${error.message}\`
You shouldn't ever receive an error like this.
Please contact ${owner.tag} in this server: ${supportServerLink}`);
		client.log.error(`CommandError: ${error.stack} \nwith this message ${msg.content}`);
		await client.users.get(ownerID).send(`Error: \`\`\`js\n${error.stack}\`\`\` has occured`);
	}
}

module.exports = commandError;
