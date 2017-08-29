const Commands = require('../../structures/new/Command.js')
const info = {
    "name": "money",
    "description": "shows your current money or the money of someone you mention",
    "aliases": ["cash", "current", "balance", "bal"],
    "examples": ["money", "money @User"]
}

class MoneyCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg) {
        try{
            let member;
            if(msg.mentions.users.size < 1)
            {
                member = msg.member
            }else{
                member = msg.mentions.members.first()
            }
            const result = await member.getEconomy(this.client)
            if(!result) return msg.reply(`looks like you or the user you mentioned haven't registered for the economy system yet you or the user can do that by using the register command!`)
            let Cash = result.cash;
            let Bank = result.bank;
            let Total = Cash + Bank
            const currency = this.client.guilds.get("199857240037916672").emojis.get("322135966322262056")
            await msg.channel.send(`${member} have ${Cash} ${currency} on the hand and ${Bank} ${currency} in the Bank thats a Total of ${Total} ${currency}.`)
        }catch(error){
            await msg.channel.send(`Errored with following Error: ${error.message}`)
        }
    }
}

module.exports = MoneyCommand
