const config        = require('../../config/config.json')
exports.run = (client, msg, params) => {
  if (!params[0]) {
    const commandNames = Array.from(client.commands.keys());
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    msg.channel.send("i've sent you an PM")
    .then(message => message.delete(10000).catch(e => {}))
    msg.author.send(`= Command List =\n\n[Use help <commandname> for details]\n\n${client.commands.map(c => `${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}`).join('\n')}`, {"code": "asciidoc"});
  } else {
    let command = params[0].toUpperCase();
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      msg.channel.send(`= ${command.help.name} = \n${command.help.description}\nAliase ${command.alias.join(", ")}\nUsage: ${config.prefix}${command.help.usage}`, {"code": "asciidoc"});
    }else{
      msg.channel.send("looks like i have no command like that :thinking:")
      msg.react("🤔")
    }
  }
};

exports.help = {
    'name': 'help',
    'description': 'displays all commands of the bot',
    'usage': 'help [command]'
}

exports.alias = ["halp", "h"]

