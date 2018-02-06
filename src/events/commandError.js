const Events = require('../structures/new/Event.js');
const { EconomyError, MusicError } = require('../structures/new/CustomErrors');

class commandError extends Events {
	constructor(client) {
		super(client);
		this.name = 'commandError';
	}

	async run(error, messageEvent, msg) {
		const { client } = this;
		if (error instanceof EconomyError) return msg.channel.send(`Economy Command failed with reason: \`${error.message}\``);
		if (error instanceof MusicError) return error.msg.edit(`Could not add the Song/Playlist because this reason \`${error.message}\``);
		if (error.message === 'Missing Permissions' || error.message === 'Missing Access' || error.message === 'Unknown Message') return;
		const { ownerID, supportServerLink } = client.config;
		const owner = client.users.get(ownerID);
		msg.reply(`An error occurred while running the command: \`${error.name}: ${error.message}\`
You shouldn't ever receive an error like this.
Please contact ${owner.tag} in this server: ${supportServerLink}`);
		client.log.error(`${error.stack}`);
		client.log.error(`CommandError: ${error.stack} \nwith this message ${msg.content}`);
		await client.users.get(ownerID).send(`Error: \`\`\`js\n${error.stack}\`\`\` has occured`);
	}
}

module.exports = commandError;
