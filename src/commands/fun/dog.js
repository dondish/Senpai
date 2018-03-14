const { Command } = require('klasa');

module.exports = class DogCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'dog',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			aliases: ['doggo', 'goodboi'],
			permLevel: 0,
			botPerms: ['ATTACH_FILES'],
			description: 'Shows a random dog'
		});
	}

	async run(msg) {
		const { url } = await this.client.weebAPI.getRandom({ type: 'animal_dog', hidden: false, nsfw: false });
		msg.channel.send('Here\'s your dog', { files: [url] });
	}
};
