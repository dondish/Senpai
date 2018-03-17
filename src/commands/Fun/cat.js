const { Command } = require('klasa');

module.exports = class CatCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['pussy', 'meow'],
			botPerms: ['ATTACH_FILES'],
			description: 'Shows a random cat'
		});
	}

	async run(msg) {
		const { url } = await this.client.weebAPI.getRandom({ type: 'animal_cat', hidden: false, nsfw: false });
		return msg.send('Here\'s your cat', { files: [url] });
	}
};
