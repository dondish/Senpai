const config                                = require('../config/config.js')
const mysql                                 = require("mysql")
var   moment                                = require('moment');
const recentlyUpdated                       = [];
var   connection                            = mysql.createConnection({
  "host"     : 'localhost',
  "user"     : config.MySQLUsername,
  "password" : config.MysQLPassword,
  "database" : 'discord_user_online'
});
module.exports = (oldMember, newMember) =>
{
  if (recentlyUpdated.includes(newMember.id)) return;
  recentlyUpdated.push(oldMember.id);
  function removeIDFromArray()
  {
    recentlyUpdated.splice(recentlyUpdated.indexOf(oldMember.id), 1)
  }
 if(newMember.presence.status  === "online" && oldMember.presence.status === "offline")
 {
    connection.query(`INSERT INTO discord_user_online.user (user_id, time) VALUES ('${newMember.id}', '${moment().unix()}')`, function (error, results, fields) {
      if (error)
      {
        if(error.code === "ER_DUB_ENTRY")
        {
          connection.query(`UPDATE discord_user_online.user SET time=${moment().unix()} WHERE user_id=${newMember.id}`, function (error,results, fields) {
            return
          })
        }
      }
      console.log("User:" + oldMember.user.username + " Changed to online!")
      return
    });
 }
 if(oldMember.presence.status  === "online" && newMember.presence.status === "offline")
 {
    connection.query(`DELETE FROM discord_user_online.user WHERE user_id=${newMember.id}`, function (error, results, fields) {
      if (error) throw error;
      console.log("User:" + oldMember.user.username + " Changed to oflline!")
      return
    });
 }
 setTimeout(removeIDFromArray, 3000);
}
