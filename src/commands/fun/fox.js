const Commands = require('../../structures/new/Command.js');
const { searchImages } = require('pixabay-api');
const info = {
	name: 'fox',
	description: 'shows a picture of a fox',
	aliases: ['foxxo'],
	examples: ['fox']
};

class FoxCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		try {
			const result = await searchImages(this.client.config.pixabayToken, 'fox');
			const Image = result.hits[Math.floor(Math.random() * result.hits.length)];
			msg.channel.send('Here\'s your Fox', { files: [Image.webformatURL] });
		} catch (error) {
			msg.channel.send('The pixabay-api had an Error! please try again');
		}
	}
}

module.exports = FoxCommand;
