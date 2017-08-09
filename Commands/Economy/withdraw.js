const rethink = require('rethinkdb');
exports.run = async (client, msg, params) => {
 const connection = await rethink.connect()
 rethink.db('Discord').table('economy')
 .get(msg.author.id)
 .run(connection, (err, result) => {
    if (err) throw err
    if (result === null) {
        connection.close()
        return msg.reply(`looks like you haven't registered for the economy system yet you can do that by using the register command!`)
    }
    let cash = result.Cash;
    let bank = result.Bank;
    let change = params[0]
    let realchange;
    let currency = client.guilds.get("199857240037916672").emojis.get("322135966322262056")
    if(change === "all" ||change === "-a"||change === "everything")
    {
        realchange = bank
    } else {
        realchange = params[0]
    }
    let amount = Number(realchange)
    if (isNaN(amount)) {
        connection.close()
        return msg.reply("that looks not like a valid number :thinking:")
    }
    if (amount > bank) {
        connection.close()
        return msg.reply("you don't have that much!")
    }
    let newbank = bank - amount
    let newCash = cash + amount
    rethink.db('Discord').table('economy')
    .get(msg.author.id)
    .update({
        "Cash": newCash,
        "Bank": newbank
    })
    .run(connection, err => {
        if (err) throw err
        msg.reply(`You successfully withdraw ${amount} ${currency} from the bank!`)
        connection.close()
    })
 })
}
exports.help = {
    'name': 'withdraw',
    'description': 'withdraw money from the bank',
    'usage': 'withdraw [amount]'
}

exports.alias = []
