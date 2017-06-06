const config   = require('../config/config.json')
module.exports = (oldMessage, newMessage) => {
  let client = newMessage.client;
  if (newMessage.author.bot) return;
  if (!newMessage.content.startsWith(config.prefix)) return;
  if (oldMessage.content === newMessage.content) return;
  let command = newMessage.content.split(' ')[0].slice(config.prefix.length).toUpperCase();
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
