const config   = require('../config/config.json')
const economy  = require('../Util/economy.js')
const rethink  = require('rethinkdb')
module.exports = async msg => {
  function checkCustomPrefix(guild) {
    return new Promise(async (resolve, reject) => {
      const connection = await rethink.connect()
      connection.use('Discord')
      rethink.table('guildConfig')
      .get(guild.id)
      .run(connection, (err, result) => {
        if (err) reject(err)
        if(result === null) {
          rethink.table('guildConfig').insert({
            "id":                 guild.id,
            "customPrefix":       "None",
            "ModlogID":           "None",
            "StarboardID":        "None",
            "MusicID":            "None"
          })
          .run(connection, err => {
            if (err) reject(err);
            connection.close()
            resolve();
          })
        } else if(result.customPrefix === "None") {
            connection.close()
            resolve();
          }else{
            connection.close()
            resolve(result.customPrefix)
          }
      })
    })
  }

  const client = msg.client;
  if (msg.author.bot) return;
  economy.messageUpdate(client, msg.author)
  let prefix
  if(msg.guild) {
    prefix = await checkCustomPrefix(msg.guild)
  }
  if(prefix === undefined) {
      prefix = config.prefix
    }
  const command = msg.content.split(' ')[0].slice(prefix.length).toUpperCase();
  const params = msg.content.split(' ').slice(1);
  let cmd;
  if (!msg.content.startsWith(prefix)) return;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if(client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
    cmd.run(client, msg, params);
  }
};
