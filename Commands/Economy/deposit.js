const rethink = require('rethinkdb');
const config  = require('../../config/config.json');

exports.run = async (client, msg, params) => {
 const connection = await rethink.connect()
 rethink.db('Discord').table('economy')
 .get(msg.author.id)
 .run(connection, (err, result) => {
    if (err) throw err
    if (result === null) {
        connection.close()
        return msg.reply(`looks like you haven't registered for the economy system yet you can do that by writing ${config.prefix}register!`)
    }
    let cash = result.Cash;
    let bank = result.Bank;
    let change = params[0]
    let realchange;
    if(change === "all" ||change === "-a"||change === "everything")
    {
        realchange = Number(cash)
    }else {
        realchange = params[0]
    }
    let amount = Number(realchange)
    if (isNaN(amount)) {
        connection.close()
        return msg.reply("that looks not like a valid number :thinking:")
    }
    if (amount > cash) {
        connection.close()
        return msg.reply("you don't have that much!")
    }
    let newbank = bank + amount
    let newCash = cash - amount
    rethink.db('Discord').table('economy')
    .get(msg.author.id)
    .update({
        "Cash": newCash,
        "Bank": newbank
    })
    .run(connection, err => {
        if (err) throw err
        msg.reply(`You successfully deposit ${amount} to the bank!`)
        connection.close()
    })
 })
}
exports.help = {
    'name': 'deposit',
    'description': 'deposit money to the bank',
    'usage': 'deposit [amount]'
}

exports.alias = []

