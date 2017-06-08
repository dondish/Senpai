const config   = require('../config/config.json')
const economy  = require('../Util/economy.js')
module.exports = msg => {
  let client = msg.client;
  if (msg.author.bot) return;
  economy.run(client, msg.author)
  if (msg.mentions.users.first() === client.user) msg.channel.send(`my current prefix is ${config.prefix}`)
  if (!msg.content.startsWith(config.prefix)) return;
  let command = msg.content.split(' ')[0].slice(config.prefix.length).toUpperCase();
  let params = msg.content.split(' ').slice(1);
  let cmd;
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
