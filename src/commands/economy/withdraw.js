const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'withdraw',
	description: 'withdraw from the bank',
	aliases: [],
	examples: ['withdraw -a', 'withdraw 1500', 'withdraw all']
};

class WithdrawCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		try {
			if (!msg.member) await msg.guild.fetchMember(msg.author);
			const data = await msg.member.getEconomy();
			if (!data) return msg.reply(`looks like you haven't registered for the economy system yet you can do that by using the register command!`);
			let { cash, bank } = data;
			let currency = this.client.guilds.get('199857240037916672').emojis.get('322135966322262056');
			let change = params[0];
			let amount;
			if (change === 'all' || change === '-a' || change === 'everything') {
				amount = bank;
			} else {
				[amount] = params;
				amount = Number(amount);
				amount = Math.floor(amount);
			}
			if (isNaN(amount)) return msg.reply('that looks not like a valid number :thinking:');
			if (amount > bank) return msg.reply("you don't have that much money!");
			if (amount <= 0) return msg.reply('Your amount must be more than 0!');
			cash += amount;
			bank -= amount;
			await msg.member.updateEconomy(cash, bank);
			await msg.reply(`You successfully withdraw ${amount} ${currency} from the bank!`);
		} catch (error) {
			await msg.channel.send(`Errored with following Error: ${error.message}`);
		}
	}
}

module.exports = WithdrawCommand;
