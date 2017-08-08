const Discord = require('discord.js');
const bot = new Discord.Client();
const fs  = require('fs');
const file = require('file')
bot.login(process.env.CLIENT_TOKEN);
require('./Util/eventloader.js')(bot);


bot.commands = new Discord.Collection();
bot.aliases  = new Discord.Collection();


file.walkSync("./Commands", function(dirPath, dirs) {
  dirs.forEach(dir => {
    fs.readdir(`./Commands/${dir}`, (err, files) => {
      if (err) throw err
      files.forEach(file => {
        let Module = require(`./Commands/${dir}/${file}`);
        bot.commands.set(Module.help.name.toUpperCase(), Module);
        console.log(`Loading Command: ${Module.help.name} from ${dir}.`);
        Module.alias.forEach(alias => {
        bot.aliases.set(alias.toUpperCase(), Module.help.name.toUpperCase());
        });
      })
    })
  })
})

process.on('unhandledRejection', function(reason, promise){
    console.log("Possibly Unhandled Rejection at: Promise ", promise, " reason: ", reason);
});
