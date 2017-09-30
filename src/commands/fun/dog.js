const Commands = require('../../structures/new/Command.js');
const snekfetch = require('snekfetch');
const info = {
	name: 'dog',
	description: 'shows a picture of a dog',
	aliases: [],
	examples: ['dog']
};

class DogCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		const response = await snekfetch.get('https://dog.ceo/api/breeds/image/random');
		if (response.body.status !== 'success') return msg.reply('The website for the API request had an error');
		const Link = response.body.message;
		msg.channel.send('Here\'s your dog', { files: [Link] });
	}
}

module.exports = DogCommand;
