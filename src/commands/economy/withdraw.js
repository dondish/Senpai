const Commands = require('../../structures/new/Command.js')
const info = {
    "name": "withdraw",
    "description": "withdraw from the bank",
    "aliases": [],
    "examples": ["withdraw -a", "withdraw 1500", "withdraw all"]
}

class WithdrawCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg, params) {
        try{
            const data = await msg.member.getEconomy(this.client)
            if(!data) return msg.reply(`looks like you haven't registered for the economy system yet you can do that by using the register command!`)
            let cash = data.cash;
            let bank = data.bank;
            let currency = this.client.guilds.get("199857240037916672").emojis.get("322135966322262056")
            let change = params[0]
            let amount
            if(change === "all" ||change === "-a"||change === "everything")
                {
                    amount = bank
                } else {
                    amount = params[0]
                    amount = Number(amount)
                }
            if (isNaN(amount)) return msg.reply("that looks not like a valid number :thinking:")
            if (amount > bank) return msg.reply("you don't have that much money!")
            cash += amount
            bank -= amount
            await msg.member.updateEconomy(this.client, cash, bank)
            await msg.reply(`You successfully withdraw ${amount} ${currency} from the bank!`)
        }catch(error){
            await msg.channel.send(`Errored with following Error: ${error.message}`)
        }
    }
}

module.exports = WithdrawCommand
