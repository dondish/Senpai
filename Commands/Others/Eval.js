const config                                = require('../../config/config.json');
const Discord                               = require('discord.js')
const packagejs                             = require('../../package.json')
const snekfetch                             = require('snekfetch')
exports.run = (client, msg, args) => {
    if(msg.author.id !== config.OwnerID) return msg.channel.send("Because of security measures, only the owner can execute this command!")
           function clean(text) {
                if (typeof(text) === "string")
                    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                else
                    return text;
            }
            function token(input) {
                function hasToken(value) {
                    if(typeof(value) !== 'string') {
                        return true;
                    }else if(value === msg.client.token) {
                        return false;
                    }else{
                        return true
                        }
                    }
                if(typeof(input) === 'string') {
                    return input.replace(msg.client.token, "[SECRET!]")
                }else if(typeof(input) === 'object') {
                    if(Array.isArray(input)){
                        return input.filter(hasToken);
                    } else {
                        return input;
                    }
                } else {
                    return input;
                }
            }
            try {
                let code = args.join(" ");
                let evaled = eval(code);
                let func = token(clean(evaled))
                if (typeof func !== "string") func = require("util").inspect(func);
                const output = '```js\n' + func + '\n```'
                const Input = '```js\n' + msg.content.slice(6) + '\n```'
                let type = typeof(evaled)
                if(func.length < 1000) {
                const embed = new Discord.RichEmbed()
                .addField('EVAL', `**Type:** ${type}`)
                .addField(':inbox_tray: Input', Input)
                .addField(':outbox_tray: Output', output)
                .setColor(0x80ff00)
                .setFooter(`Senpai-Bot version ${packagejs.version} by Yukine`)
                .setTimestamp()
                msg.channel.send({embed});
                }else {
                    snekfetch.post("https://www.hastebin.com/documents").send(func)
                    .then(res  => {
                    const embed = new Discord.RichEmbed()
                    .addField('EVAL', `**Type:** ${type}`)
                    .addField(':inbox_tray: Input', Input)
                    .addField(':outbox_tray: Output', `output was to long so it was uploaded to hastebin https://www.hastebin.com/${res.body.key}.js `, true)
                    .setFooter(`Senpai-Bot version ${packagejs.version} by Yukine`)
                    .setColor(0x80ff00)
                    msg.channel.send({embed});
                    })
                    .catch(() => {
                    const embed = new Discord.RichEmbed()
                    .addField('EVAL', `**Type:** ${type}`)
                    .addField(':inbox_tray: Input', Input)
                    .addField(':x: ERROR', `output was to long and could not upload to hastebin :/`, true)
                    .setFooter(`Senpai-Bot version ${packagejs.version} by Yukine`)
                    .setColor(0x80ff00)
                    msg.channel.send({embed});
                    });
                }
            } catch (err) {
                let errIns = require("util").inspect(err);
                const error = '```js\n' + errIns + '\n```'
                const Input = '```js\n' + msg.content.slice(6) + '\n```'
                if(errIns.length < 1000)
                    {
                    const embed = new Discord.RichEmbed()
                    .addField('EVAL', `**Type:** Error`)
                    .addField(':inbox_tray: Input', Input)
                    .addField(':x: ERROR', error, true)
                    .setFooter(`Senpai-Bot version ${packagejs.version} by Yukine`)
                    .setColor(0x80ff00)
                    msg.channel.send({embed});
                } else {
                    snekfetch.post("https://www.hastebin.com/documents").send(errIns)
                    .then(res  => {
                    const embed = new Discord.RichEmbed()
                    .addField('EVAL', `**Type:** Error`)
                    .addField(':inbox_tray: Input', Input)
                    .addField(':x: ERROR', `output was to long so it was uploaded to hastebin https://www.hastebin.com/${res.body.key}.js `, true)
                    .setFooter(`Senpai-Bot version ${packagejs.version} by Yukine`)
                    .setColor(0x80ff00)
                    msg.channel.send({embed});
                    })
                    .catch(() => {
                    const embed = new Discord.RichEmbed()
                    .addField('EVAL', `**Type:** Error`)
                    .addField(':inbox_tray: Input', Input)
                    .addField(':x: ERROR', `output was to long and could not upload to hastebin :/`, true)
                    .setFooter(`Senpai-Bot version ${packagejs.version} by Yukine`)
                    .setColor(0x80ff00)
                    msg.channel.send({embed});
                    });
                }
            }
}

exports.help = {
    'name': 'eval',
    'description': 'evaluate code on the bot (Because of security measures, only the owner can execute this command!)',
    'usage': 'eval [code]'
}

exports.alias = []
