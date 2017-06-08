const rethink = require('rethinkdb')
exports.run = async (client, msg) => {
 const connection = await rethink.connect()
 rethink.db('Discord').table('economy')
 .get(msg.author.id)
 .run(connection, (err, result) => {
     if (err) throw err
     if(result !== null)
        {
            connection.close()
            return msg.reply("You are already registered :thinking:")
        }
     rethink.db('Discord').table('economy')
     .insert(
            {
                "id": msg.author.id,
                "Cash": 0,
                "Bank": 0

            }
     )
     .run(connection, err => {
        if (err) throw err
        msg.channel.send("You successfully registered to the economy system!")
        connection.close()
     })
 })
}

exports.help = {
    'name': 'register',
    'description': 'register you for the economy system',
    'usage': 'register',
}

exports.alias = []
