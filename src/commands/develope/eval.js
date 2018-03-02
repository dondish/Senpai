const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const { inspect } = require('util');
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
		if (permissionLevel !== 0) return msg.react(this.client.globalEmoji.error);
		const code = params.join(' ');
		const token = client.token.split('').join('[^]{0,2}');
		const rev = client.token.split('').reverse().join('[^]{0,2}');
		const filter = new RegExp(`${token}|${rev}`, 'g');
		const input = `\`\`\`js\n${code}\n\`\`\``;
		try {
			let output = eval(code);
			if (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function') output = await output;
			const type = typeof output;
			output = inspect(output, { depth: 0, maxArrayLength: null });
			output = output.replace(filter, '[TOKEN]');
			let sentOutput;
			if (output.length < 1024) {
				sentOutput = `\`\`\`js\n${output}\n\`\`\``;
			} else {
				const { body } = await post('https://www.hastebin.com/documents').send(output);
				sentOutput = `output was to long so it was uploaded to hastebin instead https://www.hastebin.com/${body.key}.js`;
			}
			const embed = new RichEmbed()
				.addField('EVAL', `**Type:** ${type}`)
				.addField(':inbox_tray: Input', input)
				.addField(':outbox_tray: Output', sentOutput)
				.setColor(0x80ff00)
				.setTimestamp();
			await msg.channel.send(embed);
		} catch (error) {
			let err = inspect(error, { depth: 0, maxArrayLength: null });
			err = err.replace(filter, '[TOKEN]');
			let sentOutput;
			if (err.length < 1024) {
				sentOutput = `\`\`\`js\n${err}\n\`\`\``;
			} else {
				const { body } = await post('https://www.hastebin.com/documents').send(err);
				sentOutput = `output was to long so it was uploaded to hastebin instead https://www.hastebin.com/${body.key}.js `;
			}
			const embed = new RichEmbed()
				.addField('EVAL', `**Type:** Error`)
				.addField(':inbox_tray: Input', input)
				.addField(':x: ERROR', sentOutput)
				.setColor(0x80ff00)
				.setTimestamp();
			await msg.channel.send(embed);
		}
	}
}

module.exports = EvalCommand;
