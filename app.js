const Discord                               = require('discord.js');
const bot                                   = new Discord.Client( {"fetchAllMembers": true} );
const config                                = require('./config/config.js');
const LoginToken                            = config.BotToken;
const fs                                    = require('fs');
require('./Eventloader/eventloader.js')(bot);


bot.commands = new Discord.Collection();

fs.readdir('./Commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`Loading a total of ${files.length} commands.`);
  files.forEach(file => {
    let props = require(`./Commands/${file}`);
    bot.commands.set(props.help.name.toUpperCase(), props);
    console.log(`Loading Command: ${props.help.name}.`);
    });
  });


bot.login(LoginToken);
