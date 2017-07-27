const Discord = require('discord.js')
const rethink = require('rethinkdb')
exports.run = async (client, msg, params) => {
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if(!params[0]) return msg.reply("You must supply a prefix to use this command")
    const connection = await rethink.connect()
    connection.use('Discord')
    rethink.table('guildConfig')
    .get(msg.guild.id)
    .update({"customPrefix": params[0]})
    .run(connection, err => {
        if (err) throw err
        const embed = new Discord.RichEmbed()
        .setTitle(`Updated Prefix for ${msg.guild.name}`)
        .addField('New Prefix', params[0])
        .setTimestamp()
        .setFooter('Senpai Bot by Yukine')
        msg.channel.send({embed})
    })
}

exports.help = {
    'name': 'setprefix',
    'description': 'replace the global prefix for this server',
    'usage': 'prefix [newPrefix]'
}

exports.alias = []
