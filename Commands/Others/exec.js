const Discord = require('discord.js')
const config    = require('../../config/config.json');
const exec = require('child_process').exec;
const packagejs = require('../../package.json')

exports.run = (client, msg, args) => {
if(msg.author.id !== config.OwnerID) return msg.channel.send("Because of security measures, only the owner can execute this command!");
   const input = args.join(" ")
   if(!input) return msg.channel.send("You provided no input are you stupid?")
    exec(input, function (error, stdout, stderr) {
        if (error !== null) {
            const Input = '```Bash\n' + input + '\n```'
            const Error = '```Bash\n' + error + '\n```'
            const embed = new Discord.RichEmbed()
                .setTitle('EXEC')
                .addField(':inbox_tray: Input', Input)
                .addField(':x: Error', Error)
                .setColor(0x80ff00)
                .setFooter(`Senpai-Bot version ${packagejs.version} by Yukine`)
                .setTimestamp();
            return msg.channel.send({embed});
        }
        if(!stderr){
            const Input     = '```Bash\n' + input + '\n```'
            const Output    = '```Bash\n' + stdout + '\n```'
            const embed = new Discord.RichEmbed()
                .setTitle('EXEC')
                .addField(':inbox_tray: Input', Input)
                .addField(':outbox_tray: Output', Output)
                .setColor(0x80ff00)
                .setFooter(`Senpai-Bot version ${packagejs.version} by Yukine`)
                .setTimestamp();
            msg.channel.send({embed});
        } else {
            const Input = '```Bash\n' + input + '\n```'
            const Error = '```Bash\n' + stderr + '\n```'
            const embed = new Discord.RichEmbed()
                .setTitle('EXEC')
                .addField(':inbox_tray: Input', Input)
                .addField(':x: Error', Error)
                .setColor(0x80ff00)
                .setFooter(`Senpai-Bot version ${packagejs.version} by Yukine`)
                .setTimestamp();
            msg.channel.send({embed});
        }
    });

}

exports.help = {
    'name': 'exec',
    'description': 'execute code in a Command Line (Because of security measures, only the owner can execute this command!)',
    'usage': 'exec [code]'
}

exports.alias = []
