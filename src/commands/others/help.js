const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'help',
	description: 'shows all commands or info about a command',
	aliases: ['halp', 'h'],
	examples: ['help', 'help about']
};

class HelpCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params, prefix) {
		const { client } = this;
		let parameter1 = params[0];
		if (!parameter1) {
			const commandNames = Array.from(client.commands.keys());
			const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
			try {
				await msg.author.send(`= Command List =\n\n[Use ${prefix}help <commandname> for details]\n\n${client.commands.map(command => `${command.name}${' '.repeat(longest - command.name.length)} :: ${command.description}`).join('\n')}`,
					{
						code: 'asciidoc',
						split: true
					});
				const message = await msg.channel.send("i've sent you an PM");
				message.delete(10000);
			} catch (error) {
				await msg.channel.send('I had an error while trying to DM you, look your Direct Message settings up!');
			}
		} else {
			parameter1 = parameter1.toLowerCase();
			if (client.commands.has(parameter1)) {
				const command = client.commands.get(parameter1);
				const examples = command.examples.map(ex => `${prefix}${ex}`).join('\n');
				await msg.channel.send(`= ${command.name} = \n\n${command.description}\n\nAliase: \n${command.aliases.join('\n')}\n\nExamples: \n${examples}`, { code: 'asciidoc' });
			} else if (client.aliases.has(parameter1)) {
				const command = client.commands.get(client.aliases.get(parameter1));
				const examples = command.examples.map(ex => `${prefix}${ex}`).join('\n');
				await msg.channel.send(`= ${command.name} = \n\n${command.description}\n\nAliase: \n${command.aliases.join('\n')}\n\nExamples: \n${examples}`, { code: 'asciidoc' });
			} else {
				await msg.channel.send('looks like i have no command like that :thinking:');
				await msg.react('🤔');
			}
		}
	}
}

module.exports = HelpCommand;
