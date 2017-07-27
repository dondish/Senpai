const Discord = require('discord.js')
const rethink = require('rethinkdb')
exports.run = async (client, msg, params) => {
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if(!params[0] && !msg.mentions.channels.first()) return msg.reply("You must supply a ChannelID or Mention a Channel to use this command")
    let MusicID
    if(msg.mentions.channels.first()) {
        MusicID = msg.mentions.channels.first().id
    }else{
        if (msg.guild.channels.get(params[0]).id !== params[0]) return msg.channel.send('Seems Like your provided ID isn`t a ChannelID')
        MusicID = params[0]
    }
    const connection = await rethink.connect()
    connection.use('Discord')
    rethink.table('guildConfig')
    .get(msg.guild.id)
    .update({MusicID})
    .run(connection, err => {
        if (err) throw err
        connection.close()
        const embed = new Discord.RichEmbed()
        .setTitle(`Updated Music Channel for ${msg.guild.name}`)
        .addField('New Music Channel', `<#${MusicID}>`)
        .setTimestamp()
        .setFooter('Senpai Bot by Yukine')
        msg.channel.send({embed})
    })
}

exports.help = {
    'name': 'setmusiclog',
    'description': 'add/replace a music log Channel',
    'usage': 'setmusiclog [ChannelMention or ChanelID]'
}

exports.alias = []
