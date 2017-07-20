const Discord = require('discord.js')
const config  = require('../../config/config.json')
exports.run = (client, msg) => {
        const embed = new Discord.RichEmbed()
        .addField("Invite Link", `[Click Me](${config.InviteLink})`)
        .setColor(0x80ff00)
        .setTimestamp()
        .setFooter("Senpai Bot by Yukine")
        msg.channel.send({embed})
}

exports.help = {
    'name': 'invite',
    'description': 'shows my invite link',
    'usage': 'invite'
}

exports.alias = ["Link"]
