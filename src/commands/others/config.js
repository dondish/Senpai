const Commands = require('../../structures/new/Command.js')
const {RichEmbed} = require('discord.js')
const info = {
    "name": "config",
    "description": "shows/changes the config of this server",
    "aliases": ["cfg"],
    "examples": ["config", "config Musiclog set #channel", "config Modlog set #channel", "config Modlog delete", "config Modrole add @Role", "config Musicrole add ROLE_ID_HERE", "config Musicrole limit enable", "config Musicrole limit disable"]
}

class ConfigCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg, params) {
        let param1 = params[0]
        if(!param1){
            const result = await msg.guild.getConfig(this.client)
            let ModlogChannel = msg.guild.channels.get(result.modlogID)
            if (ModlogChannel === undefined) ModlogChannel = 'None'
            let StarboardChannel = msg.guild.channels.get(result.starboardID)
            if (StarboardChannel === undefined) StarboardChannel = 'None'
            let MusicChannel = msg.guild.channels.get(result.musicID)
            if(MusicChannel === undefined) MusicChannel = 'None'
            let ModerationRoles = result.moderationRolesIDs.map(ID => `<@&${ID}>`).join(", ")
            if (ModerationRoles.length === 0) ModerationRoles = "None"
            let MusicRoles = result.musicRolesIDs.map(ID => `<@&${ID}>`).join(", ")
            if (MusicRoles.length === 0) MusicRoles = "None"
            let musicboolean = result.musicLimited
            if(musicboolean){
                musicboolean = 'true'
            }else{
                musicboolean = 'false'
            }
            const embed = new RichEmbed()
                .setTitle(`Configuration for ${msg.guild.name}`)
                .setThumbnail(msg.guild.iconURL)
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
                .addField('Server specific prefix', `${result.prefix}`)
                .addField('Modlog Channel', ModlogChannel)
                .addField('Starboard Channel', StarboardChannel)
                .addField('Music Channel', MusicChannel)
                .addField('Moderation Roles', ModerationRoles)
                .addField('Music Roles', MusicRoles)
                .addField('Music feature limited to role?', musicboolean)
                .setTimestamp()
                .setFooter('Senpai Bot by Yukine');
                await msg.channel.send({embed});
        }else{
            param1 = param1.toLowerCase()
            const permissionLevel = await msg.member.getPermissionsLevel(this.client)
            if(permissionLevel > 2) return msg.reply("You dont have permission to do that since you dont have a moderation Role and also aren't the Owner of this server!")
            switch(param1) {
                case "prefix":
                    if(!params[1]){
                        await msg.reply("You must provide an second parameter!")
                        break;
                    }else{
                            const param2 = params[1].toLowerCase()
                            if(param2 === 'set'){
                                try{
                                    if(!params[2]) {
                                        await msg.reply("you must add a prefix to set!")
                                        break;
                                    }
                                    if(params[2].length > 3) {
                                        await msg.reply("a prefix's length must be between 1-3 characters long!")
                                        break;
                                    }
                                    await msg.guild.updateConfig(this.client, {'prefix': params[2]})
                                    const embed = new RichEmbed()
                                        .setTitle(`Updated Prefix for ${msg.guild.name}`)
                                        .addField('New Prefix', params[2])
                                        .setTimestamp()
                                        .setFooter('Senpai Bot by Yukine')
                                    await msg.channel.send({embed})
                                    break;
                                }catch(error){
                                    await msg.reply("im sorry i had an error with my Database please try again!")
                                    break;
                                }
                            }else if(param2 === 'remove' || param2 === 'delete'){
                                try{
                                    await msg.guild.updateConfig(this.client, {'prefix': "None"})
                                    await msg.channel.send("i deleted the custom prefix from this server!")
                                }catch(error){
                                    await msg.reply("im sorry i had an error with my Database please try again!")
                                    break;
                                }
                            }else{
                                await msg.reply("You provided an wrong second parameter")
                                break;
                            }
                    }
                    break;
                case "modlog":
                if(!params[1]){
                    await msg.reply("You must provide an second parameter!")
                    break;
                }else{
                        const param2 = params[1].toLowerCase()
                        if(param2 === 'set'){
                            try{
                                if(!params[2]) {
                                    await msg.reply("you must add channelID or Mention for this!")
                                    break;
                                }
                                let modlog
                                if(msg.mentions.channels.size > 0){
                                    modlog = msg.mentions.channels.first()
                                }else{
                                    modlog = msg.guild.channels.get(params[2])
                                    if(!modlog) {
                                        await msg.reply("Your provided ID is wrong! use a channelmention instead maybe")
                                        break;
                                    }
                                }
                                await msg.guild.updateConfig(this.client, {'modlogID': modlog.id})
                                const embed = new RichEmbed()
                                    .setTitle(`Updated Modlog for ${msg.guild.name}`)
                                    .addField('New Modlog', modlog.toString())
                                    .setTimestamp()
                                    .setFooter('Senpai Bot by Yukine')
                                await msg.channel.send({embed})
                                break;
                            }catch(error){
                                await msg.reply("im sorry i had an error with my Database please try again!")
                                break;
                            }
                        }else if(param2 === 'remove' || param2 === 'delete'){
                            try{
                                await msg.guild.updateConfig(this.client, {'modlogID': "None"})
                                await msg.channel.send("i deleted the modlog channel from my config!")
                            }catch(error){
                                await msg.reply("im sorry i had an error with my Database please try again!")
                                break;
                            }
                        }else{
                            await msg.reply("You provided an wrong second parameter")
                            break;
                        }
                }
                    break;
                case "musiclog":
                if(!params[1]){
                    await msg.reply("You must provide an second parameter!")
                    break;
                }else{
                        const param2 = params[1].toLowerCase()
                        if(param2 === 'set'){
                            try{
                                if(!params[2]) {
                                    await msg.reply("you must add channelID or Mention for this!")
                                    break;
                                }
                                let musiclog
                                if(msg.mentions.channels.size > 0){
                                    musiclog = msg.mentions.channels.first()
                                }else{
                                    musiclog = msg.guild.channels.get(params[2])
                                    if(!musiclog) {
                                        await msg.reply("Your provided ID is wrong! use a channelmention instead maybe")
                                        break;
                                    }
                                }
                                await msg.guild.updateConfig(this.client, {'musicID': musiclog.id})
                                const embed = new RichEmbed()
                                    .setTitle(`Updated Musiclog for ${msg.guild.name}`)
                                    .addField('New Musiclog', musiclog.toString())
                                    .setTimestamp()
                                    .setFooter('Senpai Bot by Yukine')
                                await msg.channel.send({embed})
                                break;
                            }catch(error){
                                await msg.reply("im sorry i had an error with my Database please try again!")
                                break;
                            }
                        }else if(param2 === 'remove' || param2 === 'delete'){
                            try{
                                await msg.guild.updateConfig(this.client, {'musicID': "None"})
                                await msg.channel.send("i deleted the Musiclog channel from my config!")
                            }catch(error){
                                await msg.reply("im sorry i had an error with my Database please try again!")
                                break;
                            }
                        }else{
                            await msg.reply("You provided an wrong second parameter")
                            break;
                        }
                }
                    break;
                case "starboard":
                    if(!params[1]){
                        await msg.reply("You must provide an second parameter!")
                        break;
                    }else{
                            const param2 = params[1].toLowerCase()
                            if(param2 === 'set'){
                                try{
                                    if(!params[2]) {
                                        await msg.reply("you must add channelID or Mention for this!")
                                        break;
                                    }
                                    let starboard
                                    if(msg.mentions.channels.size > 0){
                                        starboard = msg.mentions.channels.first()
                                    }else{
                                        starboard = msg.guild.channels.get(params[2])
                                        if(!starboard) {
                                            await msg.reply("Your provided ID is wrong! use a channelmention instead maybe")
                                            break;
                                        }
                                    }
                                    await msg.guild.updateConfig(this.client, {'starboardID': starboard.id})
                                    const embed = new RichEmbed()
                                        .setTitle(`Updated Starbpard Channel for ${msg.guild.name}`)
                                        .addField('New Starboard Channel', starboard.toString())
                                        .setTimestamp()
                                        .setFooter('Senpai Bot by Yukine')
                                    await msg.channel.send({embed})
                                    break;
                                }catch(error){
                                    await msg.reply("im sorry i had an error with my Database please try again!")
                                    break;
                                }
                            }else if(param2 === 'remove' || param2 === 'delete'){
                                try{
                                    await msg.guild.updateConfig(this.client, {'starboardID': "None"})
                                    await msg.channel.send("i deleted the Starboard channel from my config!")
                                }catch(error){
                                    await msg.reply("im sorry i had an error with my Database please try again!")
                                    break;
                                }
                            }else{
                                await msg.reply("You provided an wrong second parameter")
                                break;
                            }
                    }
                    break;
                case "modrole":
                if(permissionLevel > 1) {
                    await msg.reply("Only the Owner can edit the Moderation Roles!")
                    break;
                }
                if(!params[1]){
                    await msg.reply("You must provide an second parameter!")
                    break;
                }else{
                        const param2 = params[1].toLowerCase()
                        if(param2 === 'add'){
                            try{
                                if(!params[2]) {
                                    await msg.reply("you must add RoleID or Mention for this!")
                                    break;
                                }
                                let role
                                if(msg.mentions.roles.size > 0){
                                    role = msg.mentions.roles.first()
                                }else{
                                    role = msg.guild.roles.get(params[2])
                                    if(!role) {
                                        await msg.reply("Your provided ID is wrong! use a Rolemention instead maybe")
                                        break;
                                    }
                                }
                                const result = await msg.guild.getConfig(this.client)
                                const array = result.moderationRolesIDs
                                if(array.includes(role.id)) {
                                    await msg.reply('this Role is already an Modrole on this server!')
                                     break;
                                }
                                array.push(role.id)
                                await msg.guild.updateConfig(this.client, {'moderationRolesIDs': array})
                                const Roles = array.map(ID => `<@&${ID}>`).join(', ')
                                const embed = new RichEmbed()
                                    .setTitle(`Added Role ${role.name} to the Modroles`)
                                    .addField('updated Modroles', `${Roles}`)
                                    .setTimestamp()
                                    .setFooter('Senpai Bot by Yukine')
                                await msg.channel.send({embed})
                                break;
                            }catch(error){
                                await msg.reply(`im sorry i had the following error ${error.message}`)
                                break;
                            }
                        }else if(param2 === 'remove' || param2 === 'delete'){
                            try{
                                if(!params[2]) {
                                    await msg.reply("you must add RoleID or Mention for this!")
                                    break;
                                }
                                let role
                                if(msg.mentions.roles.size > 0){
                                    role = msg.mentions.roles.first()
                                }else{
                                    role = msg.guild.roles.get(params[2])
                                    if(!role) {
                                        await msg.reply("Your provided ID is wrong! use a channelmention instead maybe")
                                        break;
                                    }
                                }
                                const result = await msg.guild.getConfig(this.client)
                                const array = result.moderationRolesIDs
                                if(!array.includes(role.id)) {
                                    await msg.reply('this Role is not an Modrole on this server!')
                                     break;
                                }
                                const index = array.indexOf(role.id)
                                array.splice(index, 1)
                                await msg.guild.updateConfig(this.client, {'moderationRolesIDs': array})
                                const Roles = array.map(ID => `<@&${ID}>`).join(', ')
                                const embed = new RichEmbed()
                                    .setTitle(`deleted Role ${role.name} from the Modroles`)
                                    .addField('updated Modroles', `${Roles}`)
                                    .setTimestamp()
                                    .setFooter('Senpai Bot by Yukine')
                                await msg.channel.send({embed})
                            }catch(error){
                                await msg.reply(`im sorry i had the following error ${error.message}`)
                                break;
                            }
                        }else{
                            await msg.reply("You provided an wrong second parameter")
                            break;
                        }
                }
                    break;
                case "musicrole":
                if(!params[1]){
                    await msg.reply("You must provide an second parameter!")
                    break;
                }else{
                        const param2 = params[1].toLowerCase()
                        if(param2 === 'add'){
                            try{
                                if(!params[2]) {
                                    await msg.reply("you must add RoleID or Mention for this!")
                                    break;
                                }
                                let role
                                if(msg.mentions.roles.size > 0){
                                    role = msg.mentions.roles.first()
                                }else{
                                    role = msg.guild.roles.get(params[2])
                                    if(!role) {
                                        await msg.reply("Your provided ID is wrong! use a Rolemention instead maybe")
                                        break;
                                    }
                                }
                                const result = await msg.guild.getConfig(this.client)
                                const array = result.musicRolesIDs
                                if(array.includes(role.id)) {
                                    await msg.reply('this Role is already an Musicrole on this server!')
                                     break;
                                }
                                array.push(role.id)
                                await msg.guild.updateConfig(this.client, {'musicRolesIDs': array})
                                const Roles = array.map(ID => `<@&${ID}>`).join(', ')
                                const embed = new RichEmbed()
                                    .setTitle(`Added Role ${role.name} to the Musicroles`)
                                    .addField('updated Musicroles', `${Roles}`)
                                    .setTimestamp()
                                    .setFooter('Senpai Bot by Yukine')
                                await msg.channel.send({embed})
                                break;
                            }catch(error){
                                await msg.reply(`im sorry i had the following error ${error.message}`)
                                break;
                            }
                        }else if(param2 === 'remove' || param2 === 'delete'){
                            try{
                                if(!params[2]) {
                                    await msg.reply("you must add RoleID or Mention for this!")
                                    break;
                                }
                                let role
                                if(msg.mentions.roles.size > 0){
                                    role = msg.mentions.roles.first()
                                }else{
                                    role = msg.guild.roles.get(params[2])
                                    if(!role) {
                                        await msg.reply("Your provided ID is wrong! use a channelmention instead maybe")
                                        break;
                                    }
                                }
                                const result = await msg.guild.getConfig(this.client)
                                const array = result.musicRolesIDs
                                if(!array.includes(role.id)) {
                                    await msg.reply('this Role is not an Musicrole on this server!')
                                     break;
                                }
                                const index = array.indexOf(role.id)
                                array.splice(index, 1)
                                await msg.guild.updateConfig(this.client, {'musicRolesIDs': array})
                                const Roles = array.map(ID => `<@&${ID}>`).join(', ')
                                const embed = new RichEmbed()
                                    .setTitle(`deleted Role ${role.name} from the Musicrole`)
                                    .addField('updated Musicroles', `${Roles}`)
                                    .setTimestamp()
                                    .setFooter('Senpai Bot by Yukine')
                                await msg.channel.send({embed})
                            }catch(error){
                                await msg.reply(`im sorry i had the following error ${error.message}`)
                                break;
                            }
                        }else if(param2 === "limit"){
                            if(!params[2]) {
                                await msg.reply("You must provide an third parameter!")
                            }else{
                                const param3 = params[2].toLowerCase()
                                if(param3 === "enable" || param3 === "on"){
                                    await msg.guild.updateConfig(this.client, {'musicLimited': true})
                                    await msg.channel.send("enabled Limitation of my music feature to the Musicroles!")
                                }else if(param3 === "disable" || param3 === "off") {
                                    await msg.guild.updateConfig(this.client, {'musicLimited': false})
                                    await msg.channel.send("disabled Limitation of my music feature to the Musicroles!")
                                }else{
                                    await msg.reply("You provided an wrong third parameter")
                                    break;
                                }
                            }
                        }else{
                            await msg.reply("You provided an wrong second parameter")
                            break;
                        }
                }
                    break;
                default:
                    return msg.reply("seems like you provided a first parameter what is wrong maybe look the usage up again!")
            }

        }
    }
}

module.exports = ConfigCommand
