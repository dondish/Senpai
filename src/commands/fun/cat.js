const { Command } = require('klasa');

module.exports = class CatCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'cat',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			aliases: ['pussy', 'meow'],
			permLevel: 0,
			botPerms: ['ATTACH_FILES'],
			description: 'Shows a random cat'
		});
	}

	async run(msg) {
		const { url } = await this.client.weebAPI.getRandom({ type: 'animal_cat', hidden: false, nsfw: false });
		return msg.send('Here\'s your cat', { files: [url] });
	}
};
