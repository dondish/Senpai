const Discord = require('discord.js')
const rethink = require('rethinkdb')
const async   = require('async')
const config  = require('../../config/config.json')
exports.run = async (client, msg, params) => {
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if(!params[0] && !msg.mentions.channels.first()) return msg.reply("You must supply a ChannelID or Mention a Channel to use this command")
    let ModlogID
    if(msg.mentions.channels.first()) {
        ModlogID = msg.mentions.channels.first().id
    }else{
        if (!msg.guild.channels.get(params[0])) return msg.channel.send('Seems Like your provided ID isn`t a ChannelID please provide a valid ChannelID or mention a channel instead')
        ModlogID = params[0]
    }
    const connection = await rethink.connect()
    connection.use('Discord')
    rethink.table('guildConfig')
        .get(msg.guild.id)
        .run(connection, (err, result) => {
            if (err) throw err
            const ModroleIDs = result.ModerationRolesIDs
            let haveModrole = false
            let prefix = result.customPrefix
            if(prefix === "None") prefix = config.prefix
            async.forEach(ModroleIDs, (ID, callback) => {
            if(msg.member.roles.has(ID)) haveModrole = true;
            callback();
            }, () => {
                if(haveModrole === false && msg.guild.owner.id !== msg.author.id) return msg.reply(`You have no role that is registered as an Moderation Role so you have no permission to do that! add/remove these in my configuration with ${prefix}modrole`)
                rethink.table('guildConfig')
                    .get(msg.guild.id)
                    .update({ModlogID})
                    .run(connection, err => {
                        if (err) throw err
                        connection.close()
                        const embed = new Discord.RichEmbed()
                            .setTitle(`Updated Modlog for ${msg.guild.name}`)
                            .addField('New Modlog Channel', `<#${ModlogID}>`)
                            .setTimestamp()
                            .setFooter('Senpai Bot by Yukine')
                        msg.channel.send({embed})
                    })
                })
        })
}

exports.help = {
    'name': 'setmodlog',
    'description': 'add/replace a modlog Channel',
    'usage': 'setmodlog [ChannelMention or ChanelID]'
}

exports.alias = []
