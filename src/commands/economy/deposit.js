const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'deposit',
	description: 'deposit cash to the bank',
	aliases: [],
	examples: ['deposit -a', 'deposit 1500', 'deposit all']
};

class DepositCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		const data = await msg.member.getEconomy();
		let { cash, bank } = data;
		let { currency } = this.client.constants;
		let change = params[0];
		let amount;
		if (change === 'all' || change === '-a' || change === 'everything') {
			amount = cash;
		} else {
			[amount] = params;
			amount = Number(amount);
			amount = Math.floor(amount);
		}
		if (isNaN(amount)) return msg.reply('that looks not like a valid number :thinking:');
		if (amount > cash) return msg.reply("you don't have that much money!");
		if (amount <= 0) return msg.reply('Your amount must be more than 0!');
		cash -= amount;
		bank += amount;
		await msg.member.updateEconomy(cash, bank);
		await msg.reply(`You successfully deposit ${amount} ${currency} to the bank!`);
	}
}

module.exports = DepositCommand;
