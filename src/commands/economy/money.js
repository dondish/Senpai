const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'money',
	description: 'shows your current money or the money of someone you mention',
	aliases: ['cash', 'current', 'balance', 'bal'],
	examples: ['money', 'money @User']
};

class MoneyCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg) {
		try {
			let member;
			if (msg.mentions.users.size < 1) {
				member = msg.member;
				if (!member) await msg.guild.fetchMember(msg.author);
			} else {
				member = msg.mentions.members.first();
				if (!member) await msg.guild.fetchMember(msg.mentions.users.first());
			}
			const result = await member.getEconomy();
			if (!result) return msg.reply(`looks like you or the user you mentioned haven't registered for the economy system yet you or the user can do that by using the register command!`);
			let { cash, bank } = result;
			let Total = cash + bank;
			const currency = this.client.guilds.get('199857240037916672').emojis.get('322135966322262056');
			await msg.channel.send(`${member} have ${cash} ${currency} on the hand and ${bank} ${currency} in the Bank thats a Total of ${Total} ${currency}.`);
		} catch (error) {
			await msg.channel.send(`Errored with following Error: ${error.message}`);
		}
	}
}

module.exports = MoneyCommand;
