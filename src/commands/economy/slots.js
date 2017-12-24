const Commands = require('../../structures/new/Command.js');
const { SlotMachine, SlotSymbol } = require('slot-machine');
const info = {
	name: 'slots',
	description: 'play on a slotmachine',
	aliases: [],
	examples: ['slots [amount]']
};

class SlotsCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
		const cherry = new SlotSymbol('cherry', {
			display: '🍒',
			points: 10,
			weight: 100
		});

		const money = new SlotSymbol('money', {
			display: '💰',
			points: 100,
			weight: 50
		});

		const grape = new SlotSymbol('grape', {
			display: '🍇',
			points: 10,
			weight: 50
		});
		this.machine = new SlotMachine(3, [cherry, money, grape]);
	}

	async run(msg, params) {
		const { client } = this;
		const data = await msg.member.getEconomy();
		let { cash, bank } = data;
		let change = params[0];
		let gambleamount;
		if (change === 'all' || change === '-a' || change === 'everything') {
			gambleamount = cash;
		} else {
			[gambleamount] = params;
			gambleamount = Number(gambleamount);
			gambleamount = Math.floor(gambleamount);
		}
		let currency = client.guilds.get('199857240037916672').emojis.get('322135966322262056');
		if (isNaN(gambleamount)) return msg.reply('that is not a valid number :thinking:');
		if (gambleamount > data.cash) return msg.reply('You dont have that much money');
		if (gambleamount <= 0) return msg.reply('Your amount must be more than 0!');

		const result = this._runSlots();
		const resultString = result.visualize();
		const { winCount } = result;
		const multiplier = winCount * 0.5;
		let message;
		if (winCount === 0) {
			message = `\n\n**----Slots----**\n${resultString}\n**--------------**\n\n You lost ${gambleamount}${currency}`;
			cash -= gambleamount;
		} else {
			const wonMoney = Math.round(gambleamount * multiplier);
			message = `\n\n**----Slots----**\n${resultString}\n**--------------**\n\n You won ${wonMoney}${currency} and got your bet back`;
			cash += wonMoney;
		}
		await msg.member.updateEconomy(cash, bank);
		msg.reply(message);
	}

	_runSlots() {
		return this.machine.play();
	}
}

module.exports = SlotsCommand;
