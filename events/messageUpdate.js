const config   = require('../config/config.json')
const rethink  = require('rethinkdb')
module.exports = async (oldMessage, newMessage) => {
    function checkCustomPrefix(guild) {
    return new Promise(async (resolve, reject) => {
      const connection = await rethink.connect()
      connection.use('Discord')
      rethink.table('guildConfig')
      .get(guild.id)
      .run(connection, (err, result) => {
        if (err) reject(err)
         if(result.customPrefix === "None") {
            connection.close()
            resolve();
          }else{
            connection.close()
            resolve(result.customPrefix)
          }
      })
    })
  }
  function checkBlacklisted(user) {
    return new Promise(async (resolve, reject) => {
      try{
      const connection = await rethink.connect();
      connection.use('Discord');
      rethink.table('Blacklist')
        .get(user.id)
        .run(connection, (err, result) => {
          if (err) reject(err)
            if(result !== null) {
              resolve(true)
            } else {
              resolve(false)
            }
        })
      }catch(error) {
        reject(error)
      }
    })
  }
  const msg = newMessage
  if (msg.author.bot) return;
  let prefix
  if(msg.guild) {
    prefix = await checkCustomPrefix(msg.guild)
  }
  if(prefix === undefined) {
      prefix = config.prefix
    }
  const ignore = await checkBlacklisted(msg.author);
  if(ignore) return;
  let client = newMessage.client;
  if (newMessage.author.bot) return;
  if (!newMessage.content.startsWith(prefix)) return;
  if (oldMessage.content === newMessage.content) return;
  let command = newMessage.content.split(' ')[0].slice(prefix.length).toUpperCase();
  let params = newMessage.content.split(' ').slice(1);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if(client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    console.log("[Command]     ", newMessage.author.username + "/" + newMessage.author.id, "(" + newMessage.content + ")")
    cmd.run(client, newMessage, params);
  }

};
