const Discord = require('discord.js')
const rethink = require('rethinkdb');
const async   = require('async')
const config  = require('../../config/config.json')
exports.run = async (client, msg, params) => {
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    const connection = await rethink.connect()
    connection.use('Discord')
    rethink.table('guildConfig')
    .get(msg.guild.id)
    .run(connection, (err, result) => {
        if (err) throw err
        const ModroleIDs = result.ModerationRolesIDs
        let prefix = result.customPrefix
        if(prefix === "None") prefix = config.prefix
        let haveModerationRole = false
        async.forEach(ModroleIDs, function(ID, callback) {
            if(msg.member.roles.has(ID)) haveModerationRole = true
            callback();
        },async function() {
            if(haveModerationRole === false && msg.guild.owner.id !== msg.author.id) return msg.reply(`You have no role that is registered as an Moderation Role so you have no permission to do that! add/remove these in my configuration with ${prefix}modrole`)
            if(!params[0] || !params[1]) return msg.reply(`look the usage of ${prefix}MusicRole up again! seems like you forgot something`)
            const arg1 = params[0]
            if(arg1.toLowerCase() === 'add') {
                let RoleID
                if(msg.mentions.roles.size > 0) {
                    RoleID = msg.mentions.roles.first().id
                } else {
                    RoleID = params[1]
                    if(!msg.guild.roles.has(RoleID)) return msg.reply("Seems Like your provided ID isn`t a RoleID please provide a valid RoleID or mention a Role instead!")
                }
                const connection = await rethink.connect()
                connection.use('Discord')
                rethink.table('guildConfig')
                    .get(msg.guild.id)
                    .run(connection, (err, result) => {
                        if (err) throw err
                        let RoleIDs = result.MusicRolesIDs
                        if(RoleIDs.includes(RoleID)) {
                            connection.close()
                            return msg.reply('this Role is already an Modrole on this server!')
                        }
                        RoleIDs.push(RoleID)
                        rethink.table('guildConfig')
                            .get(msg.guild.id)
                            .update({'MusicRolesIDs': RoleIDs})
                            .run(connection, err => {
                                if (err) throw err
                                connection.close()
                                const Roles = RoleIDs.map(ID => `<@&${ID}>`).join(', ')
                                const roleName = msg.guild.roles.get(RoleID).name
                                const embed = new Discord.RichEmbed()
                                    .setTitle(`Added Role ${roleName} to the Musicroles`)
                                    .addField('updated Musicroles', `${Roles}`)
                                    .setTimestamp()
                                    .setFooter('Senpai Bot by Yukine')
                                msg.channel.send({embed})
                            })
                    })
            }else if(arg1.toLowerCase() === 'delete') {
                let RoleID
                if(msg.mentions.roles.size > 0) {
                    RoleID = msg.mentions.roles.first().id
                } else {
                    RoleID = params[1]
                    if(!msg.guild.roles.has(RoleID)) return msg.reply("Seems Like your provided ID isn`t a RoleID please provide a valid RoleID or mention a Role instead!")
                }
                const connection = await rethink.connect();
                connection.use('Discord')
                rethink.table('guildConfig')
                    .get(msg.guild.id)
                    .run(connection, (err, result) => {
                        if (err) throw err
                        const RoleIDs = result.MusicRolesIDs
                        if(!RoleIDs.includes(RoleID)) {
                            connection.close()
                            return msg.reply("this role isn't a Modrole at the moment so you can't remove it!")
                        }
                        const index = RoleIDs.indexOf(RoleID)
                        RoleIDs.splice(index, 1)
                        rethink.table('guildConfig')
                            .get(msg.guild.id)
                            .update({'MusicRolesIDs': RoleIDs})
                            .run(connection, err => {
                                if (err) throw err
                                connection.close()
                                let Roles = RoleIDs.map(ID => `<@&${ID}>`).join(', ')
                                if(Roles === '') Roles = 'None'
                                const roleName = msg.guild.roles.get(RoleID).name
                                const embed = new Discord.RichEmbed()
                                    .setTitle(`deleted Role ${roleName} to the Musicroles`)
                                    .addField('updated Musicroles', `${Roles}`)
                                    .setTimestamp()
                                    .setFooter('Senpai Bot by Yukine')
                                msg.channel.send({embed})
                            })
                    })
            }else {
                return msg.channel.send('seems like you used the first parameter wrong!')
            }
        })
    })
}

exports.help = {
    'name': 'musicrole',
    'description': 'add/delete a MusicRole',
    'usage': 'musicrole [add/delete] [RoleMention or RoleID]'
}

exports.alias = []
