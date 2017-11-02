const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const info = {
	name: 'choose',
	description: 'choose between different options ( , is the separator )',
	aliases: [],
	examples: ['choose i should go outside, i should continue coding, i should get a gf']
};

class ChooseCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	run(msg, params) {
		const options = params.join(' ').split(',');
		if (!options) return msg.reply('You have to provide words to choose from!');
		const result = options[Math.floor(Math.random() * options.length)];
		const embed = new RichEmbed()
			.addField('I choose the following:', result)
			.setColor('RANDOM')
			.setAuthor(msg.member.displayName, msg.author.displayAvatarURL);
		msg.channel.send({ embed });
	}
}

module.exports = ChooseCommand;
