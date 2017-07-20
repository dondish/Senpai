const Discord = require('discord.js')
exports.run = (client, msg, params) => {
    const waifu = params[0];
    const random = Math.floor(Math.random() * 10);
    const embed = new Discord.RichEmbed()
        .setAuthor(msg.client.user.username, msg.client.user.displayAvatarURL)
        .addField("I Rate your waifu " + waifu, `${random}/10`)
        .setColor(0x80ff00)
        .setTimestamp()
        .setFooter("Senpai Bot by Yukine");
    msg.channel.send({embed});
}

exports.help = {
    'name': 'ratewaifu',
    'description': 'rate your waifu with an scale from 0 to 10',
    'usage': 'ratewaifu [waifu name]'
}

exports.alias = ["waifu"]
