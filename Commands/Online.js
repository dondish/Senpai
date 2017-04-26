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
            connection.query(`SELECT * FROM discord_user_online.user WHERE user_id=${user.id} `, function (error, results, fields) {
            if (error) throw error;
            var timeDB          = results[0].time
            var currenttime     = moment().unix()
            var OnlineTime      = currenttime - timeDB
            msg.channel.sendMessage(`The User ${user} was ${OnlineTime} seconds online!`)
            });
    }else{
        let user    = msg.mentions.users.first()
            if(user.presence.status === "offline") return msg.reply("This User is Offline so i cant fetch how long he was Online!")
            connection.query(`SELECT * FROM discord_user_online.user WHERE user_id=${user.id} `, function (error, results, fields) {
            if (error) throw error;
            var timeDB          = results[0].time
            var currenttime     = moment().unix()
            var OnlineTime      = currenttime - timeDB
            msg.channel.sendMessage(`The User ${user} was ${OnlineTime} seconds online!`)
            });
    }
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'Online',
    'description': 'shows how long a user were online since he connected if you not mention someone it will shows your time',
    'usage': 'online [@User]'
}
