const config    = require('../../config/config.json');
const rethink   = require('rethinkdb')
exports.run = async (client, msg, params) => {
    if(!params[0]) return msg.reply("You must specify a amount!")
    const Gambleamount = Number(params[0])
    const user = msg.author
    if(isNaN(Gambleamount)) return msg.reply("that is not a valid number :thinking:")
    const connection = await rethink.connect()
    rethink.db('Discord').table('economy')
    .get(user.id)
    .run(connection, (err, result) => {
        if (err) throw err
        if (result === null) {
            connection.close()
            return msg.reply(`looks like you haven't registered for the economy system yet you can do that by writing ${config.prefix}register!`)
        }
        const money = result.C
        if(Gambleamount > money) {
            connection.close()
            return msg.reply("You dont have that much money")
        }
        const random = Math.random()
        let newCash;
        if (random > 0.5) {
            newCash = money + Gambleamount
            msg.channel.send("You won! Your amount was doubled.")
            rethink.db('Discord').table('economy')
            .get(user.id)
            .update({"Cash": newCash})
            .run(connection, err => {
            if (err) throw err
            })
        }else if(random < 0.5) {
            newCash = money - Gambleamount
            msg.channel.send("You lost! Your amount is gone.")
            rethink.db('Discord').table('economy')
            .get(user.id)
            .update({"Cash": newCash})
            .run(connection, err => {
            if (err) throw err
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
