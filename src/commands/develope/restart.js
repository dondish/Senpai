const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'restart',
	description: 'restart this Bot (only the Bot Owner can use this command!)',
	examples: ['restart']
};

class RestartCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const { client } = this;
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel !== 0) return msg.react(this.client.globalEmoji.error);
		await msg.react(this.client.globalEmoji.success);
		client.log.debug('Restarting All Shards!');
		client.shard.broadcastEval('process.exit()');
	}
}

module.exports = RestartCommand;
