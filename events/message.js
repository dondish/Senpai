const config   = require('../config/config.js')
module.exports = msg => {
  let client = msg.client;
  if (msg.author.bot) return;
  if (!msg.content.startsWith(config.prefix)) return;
  let command = msg.content.split(' ')[0].slice(config.prefix.length).toUpperCase();
  let params = msg.content.split(' ').slice(1);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  }
  if (cmd) {
    cmd.run(client, msg, params);
  }

};
