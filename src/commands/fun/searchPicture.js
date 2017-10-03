const Commands = require('../../structures/new/Command.js');
const { searchImages } = require('pixabay-api');
const info = {
	name: 'searchpicture',
	description: 'search for an picture of your input',
	aliases: ['searchp', 'picture'],
	examples: ['searchpicture snake', 'searchpicture snake in the forest', 'searchpicture penguin']
};

class PictureSearchCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		if (params < 1) return msg.reply('You must add a word to search for behind!');
		try {
			const result = await searchImages(this.client.config.pixabayToken, params.join(' '));
			if (result.total === 0) return msg.reply('Sorry i could not find anything on pixabay');
			const Image = result.hits[Math.floor(Math.random() * result.hits.length)];
			msg.channel.send('Here\'s your Picture', { files: [Image.webformatURL] });
		} catch (error) {
			msg.channel.send('The pixabay-api had an Error! please try again');
		}
	}
}

module.exports = PictureSearchCommand;
