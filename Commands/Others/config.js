const rethink = require('rethinkdb')
const Discord = require('discord.js')
exports.run = async (client, msg) => {
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    const connection = await rethink.connect()
    connection.use('Discord')
    rethink.table('guildConfig')
      .get(msg.guild.id)
      .run(connection, (err, result) => {
        if (err) throw err
        connection.close()
        let ModlogChannel = msg.guild.channels.get(result.ModlogID)
        if (ModlogChannel === undefined) ModlogChannel = 'None'
        let StarboardChannel = msg.guild.channels.get(result.StarboardID)
        if (StarboardChannel === undefined) StarboardChannel = 'None'
        let MusicChannel = msg.guild.channels.get(result.MusicID)
        if(MusicChannel === undefined) MusicChannel = 'None'

        const embed = new Discord.RichEmbed()
        .setTitle(`Configuration for ${msg.guild.name}`)
        .setThumbnail(msg.guild.iconURL)
        .setAuthor(client.user.username, client.user.avatarURL)
        .addField('Server specific prefix', `${result.customPrefix}`)
        .addField('Modlog Channel', ModlogChannel)
        .addField('Starboard Channel', StarboardChannel)
        .addField('Music Channel', MusicChannel)
        .setTimestamp()
        .setFooter('Senpai Bot by Yukine');
        msg.channel.send({embed});
      })
}

exports.help = {
    'name': 'config',
    'description': 'shows the current configuration for this server',
    'usage': 'config'
}

exports.alias = ["cfg"]
