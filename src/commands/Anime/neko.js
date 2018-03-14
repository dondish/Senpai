const { Command } = require('klasa');
const { get } = require('snekfetch');

module.exports = class NekoCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'neko',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			aliases: ['catgirl'],
			permLevel: 0,
			botPerms: ['ATTACH_FILES'],
			description: 'Shows a random neko.'
		});
	}

	async run(msg) {
		const { body } = await get('https://nekos.life/api/neko');
		msg.channel.send('Here\'s your neko', { files: [body.neko] });
	}
};
