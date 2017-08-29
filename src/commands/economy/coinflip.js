const Commands = require('../../structures/new/Command.js')
const info = {
    "name": "coinflip",
    "description": "register for the economy system",
    "aliases": ["bet"],
    "examples": ["coinflip -a", "coinflip 1000", "coinflip everything"]
}

class CoinflipCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg, params) {
        try{
            const data = await msg.member.getEconomy(this.client)
            if(!data) return msg.reply(`looks like you haven't registered for the economy system yet you can do that by using the register command!`)
            let cash = data.cash
            let change = params[0]
            let gambleamount
            if(change === "all" ||change === "-a"||change === "everything")
                {
                    gambleamount = cash
                } else {
                    gambleamount = params[0]
                    gambleamount = Number(gambleamount)
                }
            let currency = this.client.guilds.get("199857240037916672").emojis.get("322135966322262056")
            if(isNaN(gambleamount)) return msg.reply("that is not a valid number :thinking:")
            if(gambleamount > data.cash) return msg.reply("You dont have that much money")
            if(gambleamount <= 0) return msg.reply("Your amount must be more than 0!")
            const random = Math.random()
            let message;
            if(random > 0.5) {
                cash += gambleamount
                message = `You won ${gambleamount} ${currency}`
            }else{
                cash -= gambleamount
                message = `You lost ${gambleamount} ${currency}`
            }
            await msg.member.updateEconomy(this.client, cash, data.bank)
            await msg.reply(message)
        }catch(error){
            await msg.channel.send(`Errored with following Error: ${error.message}`)
        }
    }
}

module.exports = CoinflipCommand
