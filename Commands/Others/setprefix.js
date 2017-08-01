const Discord = require('discord.js')
const config = require('../../config/config.json')
const rethink = require('rethinkdb')
const async = require('async')
exports.run = async (client, msg, params) => {
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if(!params[0]) return msg.reply("You must supply a prefix to use this command")
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
                    .update({"customPrefix": params[0]})
                    .run(connection, err => {
                        if (err) throw err
                        connection.close()
                        const embed = new Discord.RichEmbed()
                            .setTitle(`Updated Prefix for ${msg.guild.name}`)
                            .addField('New Prefix', params[0])
                            .setTimestamp()
                            .setFooter('Senpai Bot by Yukine')
                            msg.channel.send({embed})
                    })
                })
        })
}

exports.help = {
    'name': 'setprefix',
    'description': 'replace the global prefix for this server',
    'usage': 'prefix [newPrefix]'
}

exports.alias = []
