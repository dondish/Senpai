const Commands = require('../../structures/new/Command.js');
const file = require('file');
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

	async run(msg, params) {
		const { client } = this;
		let { prefix } = msg.guild.getConfig();
		prefix = prefix ? prefix : client.config.prefix;
		let param1 = params[0];
		if (!param1) {
			let categories = await this.asyncReadDir('./commands');
			categories = categories.map(groupPath => groupPath.slice(9));
			const arrayOfCommandCollections = [];
			for (let i = 0; i < categories.length; i++) {
				const result = client.commands.filter(command => command.group === categories[i]);
				arrayOfCommandCollections.push(result);
			}
			const categorieStrings = [];
			for (let i = 0; i < arrayOfCommandCollections.length; i++) {
				const result = `__${arrayOfCommandCollections[i].first().group}__\n${arrayOfCommandCollections[i].map(command => `**${command.name}:** ${command.description}`).join('\n')}\n`;
				categorieStrings.push(result);
			}
			try {
				const message = await msg.channel.send("i've sent you a PM");
				message.delete(10000);
				await msg.author.send(`To run a command in ${msg.guild.name}, use ${prefix}command or @${this.client.user.tag} command.\nUse help <command> to view detailed information about a specific command.\n\n${categorieStrings.join('\n')}\nyou can get a list of all my commands with usage and details here: \nhttp://yukine.ga/Senpai/commands/`, { split: true });
			} catch (error) {
				await msg.channel.send('I had an error while trying to DM you, look your Direct Message settings up!');
			}
		} else {
			param1 = param1.toLowerCase();
			if (client.commands.has(param1)) {
				const command = client.commands.get(param1);
				const examples = command.examples.map(ex => `${prefix}${ex}`).join('\n');
				await msg.channel.send(`= ${command.name} = \n\n${command.description}\n\nAliase: \n${command.aliases.join('\n')}\n\nExamples: \n${examples}`, { code: 'asciidoc' });
			} else if (client.aliases.has(param1)) {
				const command = client.commands.get(client.aliases.get(param1));
				const examples = command.examples.map(ex => `${prefix}${ex}`).join('\n');
				await msg.channel.send(`= ${command.name} = \n\n${command.description}\n\nAliase: \n${command.aliases.join('\n')}\n\nExamples: \n${examples}`, { code: 'asciidoc' });
			} else {
				await msg.channel.send('looks like i have no command like that :thinking:');
				await msg.react('🤔');
			}
		}
	}

	asyncReadDir(path) {
		return new Promise((resolve, reject) => {
			file.walk(path, (err, dirPath, dirs) => {
				if (err) return reject(err);
				resolve(dirs);
			});
		});
	}
}

module.exports = HelpCommand;
