let   moment                                = require('moment');
const rethink                               = require('rethinkdb')
exports.run = async function(client, msg)  {
    const connection = await rethink.connect();
    connection.use('Discord')
    const time = moment().unix();
    let user;
    if(msg.mentions.users.size < 1)
    {
        user = msg.author
        if(user.presence.status === "offline") return msg.reply("You're Status is offline so i cant say you how long your status was online :thinking:")
    }else{
        user = msg.mentions.users.first()
        if(user.presence.status === "offline") return msg.reply("The Users Status is offline so i cant say you how long there status was online :thinking:")
    }
    rethink.table('OnlineTime').get(`${user.id}`)
    .run(connection, (err, result) => {
        if (err) return msg.channel.send("I had an erro while trying to fetch information from my DB please contact my DEV!")
        if (result === null) return msg.channel.send("oh looks like i have an leak in my DB! Im sorry but i cant tell you how long you were Online")
        let timeDB = result.time
        let difference = time - timeDB
        let timetype
        if(difference > 60) {
            timetype = "Minute/s"
            difference /=60
        }else if(difference > 3600) {
            timetype = "Hour/s"
            difference /=3600
        }else if(difference > 86400) {
            timetype = "Day/s"
            difference /=86400
        }else{
            timetype = "Second/s"
        }
        msg.channel.send(`The User ${user} was ${Math.round(difference)} ${timetype} online!`)
        connection.close()
    })
}

exports.help = {
    'name': 'Online',
    'description': 'shows how long a user were online since i connected to your Server if you not mention someone it will shows your time',
    'usage': 'online [@User]'
}

exports.alias = []
