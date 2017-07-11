const Discord                               = require('discord.js');
const bot                                   = new Discord.Client();
const config                                = require('./config/config.json');
const fs                                    = require('fs');
bot.login(process.env.CLIENT_TOKEN);
require('./Util/eventloader.js')(bot);


bot.commands = new Discord.Collection();
bot.aliases  = new Discord.Collection();

fs.readdir('./Commands/Fun', (err, files) => {
  if (err) console.error(err);
  console.log(`Loading Module Fun (${files.length} Commands).`);
  files.forEach(file => {
    let Module = require(`./Commands/Fun/${file}`);
    bot.commands.set(Module.help.name.toUpperCase(), Module);
    console.log(`Loading Command: ${Module.help.name} from Fun.`);
      Module.alias.forEach(alias => {
      bot.aliases.set(alias.toUpperCase(), Module.help.name.toUpperCase());
      });
    });
  });

fs.readdir('./Commands/Moderation', (err, files) => {
  if (err) console.error(err);
  console.log(`Loading Module Moderation (${files.length} Commands).`);
  files.forEach(file => {
    let Module = require(`./Commands/Moderation/${file}`);
    bot.commands.set(Module.help.name.toUpperCase(), Module);
    console.log(`Loading Command: ${Module.help.name} from Moderation.`);
      Module.alias.forEach(alias => {
      bot.aliases.set(alias.toUpperCase(), Module.help.name.toUpperCase());
      });
    });
  });

fs.readdir('./Commands/Music', (err, files) => {
  if (err) console.error(err);
  console.log(`Loading Module Music (${files.length} Commands).`);
  files.forEach(file => {
    let Module = require(`./Commands/Music/${file}`);
    bot.commands.set(Module.help.name.toUpperCase(), Module);
    console.log(`Loading Command: ${Module.help.name} from Music.`);
      Module.alias.forEach(alias => {
      bot.aliases.set(alias.toUpperCase(), Module.help.name.toUpperCase());
      });
    });
  });

fs.readdir('./Commands/Others', (err, files) => {
  if (err) console.error(err);
  console.log(`Loading Module Others (${files.length} Commands).`);
  files.forEach(file => {
    let Module = require(`./Commands/Others/${file}`);
    bot.commands.set(Module.help.name.toUpperCase(), Module);
    console.log(`Loading Command: ${Module.help.name} from Others.`);
      Module.alias.forEach(alias => {
      bot.aliases.set(alias.toUpperCase(), Module.help.name.toUpperCase());
      });
    });
  });

fs.readdir('./Commands/Economy', (err, files) => {
  if (err) console.error(err);
  console.log(`Loading Module Fun (${files.length} Commands).`);
  files.forEach(file => {
    let Module = require(`./Commands/Economy/${file}`);
    bot.commands.set(Module.help.name.toUpperCase(), Module);
    console.log(`Loading Command: ${Module.help.name} from Economy.`);
      Module.alias.forEach(alias => {
      bot.aliases.set(alias.toUpperCase(), Module.help.name.toUpperCase());
      });
    });
  });

process.on('unhandledRejection', function(reason, p){
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});
