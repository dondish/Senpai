const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const util = require('util');
const { post } = require('snekfetch');
const info = {
	name: 'eval',
	description: 'an command to evaluate javascript code (only the Bot Owner can use this command!)',
	aliases: [],
	examples: ["eval msg.channel.send('Test')", 'eval msg.client']
};

class EvalCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		const { client } = this;
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel !== 0) return msg.react(client.emojis.get('361218228103675905'));
		const code = params.join(' ');
		const token = client.token.split('').join('[^]{0,2}');
		const rev = client.token.split('').reverse().join('[^]{0,2}');
		const filter = new RegExp(`${token}|${rev}`, 'g');
		const input = `\`\`\`js\n${code}\n\`\`\``;
		try {
			let output = eval(code);
			if (output instanceof Promise) output = await output;
			let type = typeof output;
			output = util.inspect(output, { depth: 0, maxArrayLength: null });
			output = output.replace(filter, '[TOKEN]');
			const discordOutput = `\`\`\`js\n${output}\n\`\`\``;
			if (output.length < 1024) {
				const embed = new RichEmbed()
					.addField('EVAL', `**Type:** ${type}`)
					.addField(':inbox_tray: Input', input)
					.addField(':outbox_tray: Output', discordOutput)
					.setColor(0x80ff00)
					.setFooter(`Senpai-Bot version ${client.version} by Yukine`)
					.setTimestamp();
				await msg.channel.send({ embed });
			} else {
				const res = await post('https://www.hastebin.com/documents').send(output);
				const embed = new RichEmbed()
					.addField('EVAL', `**Type:** ${type}`)
					.addField(':inbox_tray: Input', input)
					.addField(':outbox_tray: Output', `output was to long so it was uploaded to hastebin https://www.hastebin.com/${res.body.key}.js `, true)
					.setFooter(`Senpai-Bot version ${client.version} by Yukine`)
					.setColor(0x80ff00)
					.setTimestamp();
				await msg.channel.send({ embed });
			}
		} catch (error) {
			let err = util.inspect(error, { depth: 0, maxArrayLength: 0 });
			err = err.replace(filter, '[TOKEN]');
			const errDiscord = `\`\`\`js\n${err}\n\`\`\``;
			if (err.length < 1024) {
				const embed = new RichEmbed()
					.addField('EVAL', `**Type:** Error`)
					.addField(':inbox_tray: Input', input)
					.addField(':x: ERROR', errDiscord)
					.setFooter(`Senpai-Bot version ${client.version} by Yukine`)
					.setColor(0x80ff00);
				msg.channel.send({ embed });
			} else {
				const res = await post('https://www.hastebin.com/documents').send(err);
				const embed = new RichEmbed()
					.addField('EVAL', `**Type:** Error`)
					.addField(':inbox_tray: Input', input)
					.addField(':x: ERROR', `output was to long so it was uploaded to hastebin https://www.hastebin.com/${res.body.key}.js `, true)
					.setFooter(`Senpai-Bot version ${client.version} by Yukine`)
					.setColor(0x80ff00);
				msg.channel.send({ embed });
			}
		}
	}
}

module.exports = EvalCommand;
