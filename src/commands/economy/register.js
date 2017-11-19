const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'register',
	description: 'register for the economy system',
	aliases: [],
	examples: ['register']
};

class RegisterCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		if (!msg.member) await msg.guild.fetchMember(msg.author);
		await msg.member.addToEconomy();
		await msg.channel.send('You successfully registered to the economy system!');
	}
}

module.exports = RegisterCommand;
