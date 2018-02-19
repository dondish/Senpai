const Commands = require('../../structures/new/Command.js');
const urban = require('relevant-urban');
const info = {
	name: 'urban',
	description: 'search for a word on the urban dictonary',
	examples: ['urban LOL']
};

class UrbanCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		if (params.length < 1) return msg.reply('You must add a word to search for');
		try {
			const result = await urban.random(params.join(' '));
			msg.channel.send(`**${result.word}** by ${result.author}\n\n***Definition:***\n${result.definition}\n\n***Example***\n${result.example}\n\n${result.thumbsUp} :thumbsup:\n${result.thumbsDown} :thumbsdown:`);
		} catch (error) {
			msg.channel.send("seems like i didn't have found anything in the urban dictonary!");
		}
	}
}

module.exports = UrbanCommand;
