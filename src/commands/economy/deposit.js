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
		try {
			const data = await msg.member.getEconomy(this.client);
			if (!data) return msg.reply(`looks like you haven't registered for the economy system yet you can do that by using the register command!`);
			let { cash } = data;
			let { bank } = data;
			let currency = this.client.guilds.get('199857240037916672').emojis.get('322135966322262056');
			let change = params[0];
			let amount;
			if (change === 'all' || change === '-a' || change === 'everything') {
				amount = cash;
			} else {
				[amount] = params;
				amount = Number(amount);
			}
			if (isNaN(amount)) return msg.reply('that looks not like a valid number :thinking:');
			if (amount > cash) return msg.reply("you don't have that much money!");
			if (amount <= 0) return msg.reply('Your amount must be more than 0!');
			cash -= amount;
			bank += amount;
			await msg.member.updateEconomy(this.client, cash, bank);
			await msg.reply(`You successfully deposit ${amount} ${currency} to the bank!`);
		} catch (error) {
			await msg.channel.send(`Errored with following Error: ${error.message}`);
		}
	}
}

module.exports = DepositCommand;
