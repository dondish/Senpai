const Discord = require('discord.js')
exports.run = (client, msg) => {
        msg.channel.send('Pinging...').then(sent => {
        const embed = new Discord.RichEmbed()
        .setAuthor(`${msg.client.user.username}`, `${msg.client.user.avatarURL}`)
        .setTitle("Pong! :ping_pong:")
        .addField("Heartbeat", `${Math.floor(msg.client.ping)}ms`  , true)
        .addField("Message", `${sent.createdTimestamp - msg.createdTimestamp}ms`, true)
        .setColor(0x80ff00)
        .setTimestamp()
        .setFooter("Senpai Bot by Yukine")
        sent.edit({embed})
        })
}

exports.help = {
    'name': 'Ping',
    'description': 'shows the ping of the Bot in ms',
    'usage': 'ping'
}

exports.alias = ["latency"]
