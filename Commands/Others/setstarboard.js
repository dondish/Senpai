const Discord = require('discord.js')
const rethink = require('rethinkdb')
exports.run = async (client, msg, params) => {
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if(!params[0] && !msg.mentions.channels.first()) return msg.reply("You must supply a ChannelID or Mention a Channel to use this command")
    let StarboardID
    if(msg.mentions.channels.first()) {
        StarboardID = msg.mentions.channels.first().id
    }else{
        if (msg.guild.channels.get(params[0]).id !== params[0]) return msg.channel.send('Seems Like your provided ID isn`t a ChannelID')
        StarboardID = params[0]
    }
    const connection = await rethink.connect()
    connection.use('Discord')
    rethink.table('guildConfig')
    .get(msg.guild.id)
    .update({StarboardID})
    .run(connection, err => {
        if (err) throw err
        const embed = new Discord.RichEmbed()
        .setTitle(`Updated Starboard Channel for ${msg.guild.name}`)
        .addField('New Starboard Channel', `<#${StarboardID}>`)
        .setTimestamp()
        .setFooter('Senpai Bot by Yukine')
        msg.channel.send({embed})
    })
}

exports.help = {
    'name': 'setstarboard',
    'description': 'add/replace a Starboard Channel',
    'usage': 'setstarboard [ChannelMention or ChanelID]'
}

exports.alias = []
