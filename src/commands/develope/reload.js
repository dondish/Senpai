const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'reload',
	description: 'reload a command (only the Bot Owner can use this command!)',
	aliases: [],
	examples: ['reload invite', 'reload cat']
};

class ReloadCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		const { client } = this;
		const [command] = params;
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel !== 0) return msg.react(this.client.globalEmoji.error);
		if (!client.commands.has(command)) return msg.channel.send(`no command called ${command} found`);
		const DeleteCommand = client.commands.get(command);
		DeleteCommand.aliases.forEach(alias => {
			client.aliases.delete(alias);
		});
		client.commands.delete(command);
		delete require.cache[require.resolve(`../${DeleteCommand.group}/${DeleteCommand.name}.js`)];
		const CommandClass = require(`../${DeleteCommand.group}/${DeleteCommand.name}.js`);
		const Command = new CommandClass(client, DeleteCommand.group);
		client.commands.set(Command.name, Command);
		Command.aliases.forEach(alias => {
			client.aliases.set(alias, Command.name);
		});
		msg.react(this.client.globalEmoji.success);
		client.log.debug(`Reloaded Command: ${Command.name}.`);
	}
}

module.exports = ReloadCommand;
