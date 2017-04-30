const config                                = require('../config/config.js');
const MALjs                                 = require('MALjs');
const mal                                   = new MALjs(config.MyAnimeListUsername, config.MyAnimeListPassword);
const mysql                                 = require("mysql")
var   moment                                = require('moment');
var   firstStartup                          = false
var   connection                            = mysql.createConnection({
  "host"     : 'localhost',
  "user"     : config.MySQLUsername,
  "password" : config.MysQLPassword,
  "database" : 'discord_user_online'
});
module.exports = bot => {
  console.log('-----------------------------------------------------------------------------');
  console.log('Username:      ' + bot.user.username);
  console.log('ID:            ' + bot.user.id);
  console.log('Servers:       ' + bot.guilds.size );
  console.log('Channels:      ' + bot.channels.size);
  console.log('-----------------------------------------------------------------------------');
  console.log('Other API Status:')
  mal.verifyCredentials()
    .then(result => {
      if (undefined != result)
        {
          console.log("MAL API READY")
        }
    })
    .catch(err => console.error(err));
  console.log('-----------------------------------------------------------------------------');
  bot.user.setGame("%help")
  if(firstStartup)
  {
    bot.users.forEach( user => {
    if(user.presence.status === "offline") return
    connection.query(`INSERT INTO discord_user_online.user (user_id, time) VALUES ('${user.id}', '${moment().unix()}')`, function (error, results, fields) {
      if (error) throw error;
    });
  });
  console.log("Inserted All User Times into the MySQL Database!")
  firstStartup = false
  }
};

