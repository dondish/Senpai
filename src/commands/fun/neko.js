const Commands = require('../../structures/new/Command.js');
const { get } = require('snekfetch');
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
		const { body } = await get('https://nekos.life/api/neko');
		msg.channel.send('Here\'s your neko', { files: [body.neko] });
	}
}

module.exports = NekoCommand;
