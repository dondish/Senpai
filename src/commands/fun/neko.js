const Commands = require('../../structures/new/Command.js');
const snekfetch = require('snekfetch');
const info = {
	name: 'neko',
	description: 'shows a picture of a neko',
	aliases: [],
	examples: ['neko']
};

class NekoCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const response = await snekfetch.get('https://nekos.life/api/neko');
		const Link = response.body.neko;
		msg.channel.send('Here\'s your neko', { files: [Link] });
	}
}

module.exports = NekoCommand;
