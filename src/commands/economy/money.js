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
		let member;
		if (msg.mentions.users.size < 1) {
			member = msg.member;
		} else {
			member = msg.mentions.members.first();
			if (!member) await msg.guild.fetchMember(msg.mentions.users.first());
		}
		const result = await member.getEconomy();
		let { cash, bank } = result;
		let total = cash + bank;
		const currency = this.client.guilds.get('199857240037916672').emojis.get('322135966322262056');
		await msg.channel.send(`${member} have ${cash} ${currency} on the hand and ${bank} ${currency} in the Bank thats a Total of ${total} ${currency}.`);
	}
}

module.exports = MoneyCommand;
