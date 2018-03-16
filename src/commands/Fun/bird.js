const { Command } = require('klasa');
const { searchImages } = require('pixabay-api');

module.exports = class BirdCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'bird',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			aliases: ['birb'],
			permLevel: 0,
			botPerms: ['ATTACH_FILES'],
			description: 'Shows a random bird'
		});
	}

	async run(msg) {
		try {
			const result = await searchImages(this.client.tokens.pixabayToken, 'bird');
			const Image = result.hits[Math.floor(Math.random() * result.hits.length)];
			return msg.send('Here\'s your Bird', { files: [Image.webformatURL] });
		} catch (error) {
			return msg.send('The pixabay-api had an Error! please try again');
		}
	}
};
