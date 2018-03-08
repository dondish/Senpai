const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'enablecommand',
	description: 'enables a Command"',
	aliases: [],
	examples: ['enablecommand cat', 'enablecommand skip']
};

class EnableCommandCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, args) {
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel > 3) return msg.reply("You dont have permission to do that since you dont have a moderation Role and also aren't the Owner of this server!");
		const { disabledCommands } = await msg.guild.getConfig();
		let command = args[0];
		if (!command) return msg.reply('You need to add a Command to enable behind!');
		command = command.toLowerCase();
		if (!disabledCommands.includes(args[0])) return msg.reply('This Command is not disabled on this server!');
		command = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
		if (!command) return msg.reply('No Command or Alias with that name found!');
		if (['config', 'others'].includes(command.group)) return msg.reply('For security reasons you cannot disable Commands form the Category Config or Others!');
		disabledCommands.splice(disabledCommands.indexOf(command.name), 1);
		await msg.guild.updateConfig({ disabledCommands });
		return msg.channel.send(`Sucessfully enabled ${command.name} on ${msg.guild.name}`);
	}
}

module.exports = EnableCommandCommand;
