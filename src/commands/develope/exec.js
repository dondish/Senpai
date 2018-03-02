const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const { exec } = require('child_process');
const info = {
	name: 'exec',
	description: 'execute a command in a commandline (only the Bot Owner can use this command!)',
	aliases: [],
	examples: ['exec node -v', 'exec npm -v']
};

class ExecCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		const { client } = this;
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel !== 0) return msg.react(this.client.globalEmoji.error);
		const code = params.join(' ');
		if (!code) return msg.channel.send('You provided no input are you stupid?');
		exec(code, (error, stdout, stderr) => {
			const input = `\`\`\`Bash\n${code}\n\`\`\``;
			if (error) {
				let output = `\`\`\`Bash\n${error}\n\`\`\``;
				const embed = new RichEmbed()
					.setTitle('EXEC')
					.addField(':inbox_tray: Input', input)
					.addField(':x: Error', output)
					.setColor(0x80ff00)
					.setFooter(`Senpai version ${client.version} by Yukine`)
					.setTimestamp();
				return msg.channel.send(embed);
			} else {
				const output = stderr || stdout;
				const output2 = `\`\`\`Bash\n${output}\n\`\`\``;
				const embed = new RichEmbed()
					.setTitle('EXEC')
					.addField(':inbox_tray: Input', input)
					.addField(':outbox_tray: Output', output2)
					.setColor(0x80ff00)
					.setTimestamp();
				return msg.channel.send(embed);
			}
		});
	}
}

module.exports = ExecCommand;
