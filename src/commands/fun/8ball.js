const Commands = require('../../structures/new/Command.js');
const info = {
	name: '8ball',
	description: 'ask a yes/no question and get a answer',
	examples: ['8ball is this working?']
};

class QuestionCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
		this.options = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Yes', 'Signs point to yes', 'Reply hazy try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', "Don't count on it", 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful'];
	}

	async run(msg, params) {
		if (params.length < 1) return msg.reply('8ball is for questions so please add a question behind.');
		const { options } = this;
		await msg.reply(`You ask me \`${params.join(' ')}\` and my answer is: **${options[Math.floor(Math.random() * options.length)]}**`);
	}
}

module.exports = QuestionCommand;
