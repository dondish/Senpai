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
		const permissionLevel = await msg.member.getPermissionsLevel(client);
		if (permissionLevel !== 0) return msg.react(this.client.emojis.get('361218228103675905'));
		if (!this.client.commands.has(command)) return msg.channel.send(`no command called ${command} found`);
		const DeleteCommand = this.client.commands.get(command);
		DeleteCommand.aliases.forEach(alias => {
			this.client.aliases.delete(alias);
		});
		this.client.commands.delete(command);
		delete require.cache[require.resolve(`../${DeleteCommand.group}/${DeleteCommand.name}.js`)];
		const CommandClass = require(`../${DeleteCommand.group}/${DeleteCommand.name}.js`);
		const Command = new CommandClass(this.client, DeleteCommand.group);
		this.client.commands.set(Command.name, Command);
		Command.aliases.forEach(alias => {
			this.client.aliases.set(alias, Command.name);
		});
		msg.react(this.client.emojis.get('361218217605070858'));
		this.client.log.debug(`Reloaded Command: ${Command.name}.`);
	}
}

module.exports = ReloadCommand;
