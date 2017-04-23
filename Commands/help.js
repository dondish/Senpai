const config        = require('../config/config.js')
exports.run = (client, msg, params) => {
  if (!params[0]) {
    const commandNames = Array.from(client.commands.keys());
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    msg.channel.sendMessage("i've sent you an PM")
    .then(message => message.delete(10000))
    msg.author.sendCode('asciidoc', `= Command List =\n\n[Use ${config.prefix}help <commandname> for details]\n\n${client.commands.map(c => `${config.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`).join('\n')}`);
  } else {
    let command = params[0].toUpperCase();
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      msg.channel.sendCode('asciidoc', `= ${command.help.name} = \n${command.help.description}\nUsage: ${config.prefix}${command.help.usage}`);
    }
  }
  console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
};

exports.help = {
    'name': 'help',
    'description': 'Displays all commands of the bot',
    'usage': 'help [command]'
}
