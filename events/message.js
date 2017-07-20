const config   = require('../config/config.json')
const economy  = require('../Util/economy.js')
module.exports = msg => {
  const client = msg.client;
  if (msg.author.bot) return;
  economy.messageUpdate(client, msg.author)
  const command = msg.content.split(' ')[0].slice(config.prefix.length).toUpperCase();
  const params = msg.content.split(' ').slice(1);
  let cmd;
  if (msg.mentions.users.first() === client.user) return msg.channel.send(`it's not like i noticed you, b-baka`)
  if (!msg.content.startsWith(config.prefix)) return;
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
