const config                                = require('../config/config.js');
const mysql                                 = require("mysql")
var   moment                                = require('moment');
var   connection                            = mysql.createConnection({
  "host"     : 'localhost',
  "user"     : config.MySQLUsername,
  "password" : config.MysQLPassword,
  "database" : 'discord_user_online'
});


exports.run = (client, msg) => {
    if (msg.mentions.users.size < 1)
    {
        let user    = msg.author
            if (msg.author.presence.status === "offline") return msg.reply("You are showed as offline you cant get your online time because of that Sorry!")
            connection.query(`SELECT * FROM discord_user_online.user WHERE user_id=${user.id} `, function (error, results, fields) {
            if (error) throw error;
            var timeDB          = results[0].time
            var currenttime     = moment().unix()
            var OnlineTime      = currenttime - timeDB
            var TimeType
            var ShowTime
            var ti
            if(OnlineTime >= 3600)
            {
                TimeType = "hour"
                ti   = OnlineTime/3600
                ShowTime = Math.round(ti * 10) / 10;
            }else if(OnlineTime >= 60)
            {
                TimeType = "minute"
                ti   = OnlineTime/60
                ShowTime = Math.round(ti * 10) / 10;
            }else
            {
                TimeType = "seconds"
                ShowTime = OnlineTime
            }
            msg.channel.send(`The User ${user} was ${ShowTime} ${TimeType}/s online!`)
            });
    }else{
        let user    = msg.mentions.users.first()
            if(user.presence.status === "offline") return msg.reply("This User is Offline so i cant fetch how long he was Online!")
            connection.query(`SELECT * FROM discord_user_online.user WHERE user_id=${user.id} `, function (error, results, fields) {
            if (error) msg.reply("I had an error while try to search your ID in my DB if this happens mutiple times please contact my DEV")
            var timeDB          = results[0].time
            var currenttime     = moment().unix()
            var OnlineTime      = currenttime - timeDB
            var TimeType
            var ShowTime
            var ti
            if(OnlineTime >= 3600)
            {
                TimeType = "hour"
                ti   = OnlineTime/3600
                ShowTime = Math.round(ti * 10) / 10;
            }else if(OnlineTime >= 60)
            {
                TimeType = "minute"
                ti   = OnlineTime/60
                ShowTime = Math.round(ti * 10) / 10;
            }else
            {
                TimeType = "seconds"
                ShowTime = OnlineTime
            }
            msg.channel.send(`The User ${user} was ${ShowTime} ${TimeType}/s online!`)
            });
    }
}

exports.help = {
    'name': 'Online',
    'description': 'shows how long a user were online since he connected if you not mention someone it will shows your time',
    'usage': 'online [@User]'
}
