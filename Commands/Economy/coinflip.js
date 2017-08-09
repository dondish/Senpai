const rethink   = require('rethinkdb')
exports.run = async (client, msg, params) => {
    if(!params[0]) return msg.reply("You must specify a amount!")
    const Gambleamount = Number(params[0])
    let currency = client.guilds.get("199857240037916672").emojis.get("322135966322262056")
    const user = msg.author
    if(isNaN(Gambleamount)) return msg.reply("that is not a valid number :thinking:")
    const connection = await rethink.connect()
    rethink.db('Discord').table('economy')
    .get(user.id)
    .run(connection, (err, result) => {
        if (err) throw err
        if (result === null) {
            connection.close()
            return msg.reply(`looks like you haven't registered for the economy system yet you can do that by using the register command!`)
        }
        const money = result.Cash
        if(Gambleamount > money) {
            connection.close()
            return msg.reply("You dont have that much money")
        }
        const random = Math.random()
        let newCash;
        if (random > 0.5) {
            newCash = money + Gambleamount
            msg.channel.send(`You won ${Gambleamount} ${currency}`)
            rethink.db('Discord').table('economy')
            .get(user.id)
            .update({"Cash": newCash})
            .run(connection, err => {
            if (err) throw err
            connection.close()
            })
        }else if(random < 0.5) {
            newCash = money - Gambleamount
            msg.channel.send(`You lost ${Gambleamount} ${currency}`)
            rethink.db('Discord').table('economy')
            .get(user.id)
            .update({"Cash": newCash})
            .run(connection, err => {
            if (err) throw err
            connection.close()
            })
        }
    })
}


exports.help = {
    'name': 'coinflip',
    'description': 'gamble with your Cash',
    'usage': 'coinflip [amount]'
}

exports.alias = []
