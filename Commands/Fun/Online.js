let   moment                                = require('moment');
const rethink                               = require('rethinkdb')
exports.run = async function(client, msg)  {
    const connection = await rethink.connect();
    connection.use('Discord')
    const time = moment().format();
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
        let usertime = result.time
        let timetype = "hour/s"
        let difference = moment(usertime).diff(time, 'hours', true)
        if(difference < 1)
        {
            difference = moment(usertime).diff(time, 'minutes', true)
            timetype = "minute/s"
        }
        let rounded = Math.ceil(difference*100000)/100000
        msg.channel.send(`The User ${user} was ${rounded} ${timetype} online!`)
        connection.close()
    })
}

exports.help = {
    'name': 'Online',
    'description': 'shows how long a user were online since i connected to your Server if you not mention someone it will shows your time',
    'usage': 'online [@User]'
}

exports.alias = []
