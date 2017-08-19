const Commands = require('../../structures/new/Command.js')
const {RichEmbed} = require('discord.js')
const info = {
    "name": "config",
    "description": "shows/changes the config of this server",
    "aliases": ["cfg"],
    "examples": ["config", "config set Musiclog #channel", "config set Modlog #channel", "config delete Modlog", "config add Modrole @Role", "config add Musicrole ROLE_ID_HERE"]
}

class ConfigCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg, params) {
        const param1 = params[0]
        if(!param1){
            const result = await msg.guild.getConfig(this.client)
            let ModlogChannel = msg.guild.channels.get(result.ModlogID)
            if (ModlogChannel === undefined) ModlogChannel = 'None'
            let StarboardChannel = msg.guild.channels.get(result.StarboardID)
            if (StarboardChannel === undefined) StarboardChannel = 'None'
            let MusicChannel = msg.guild.channels.get(result.MusicID)
            if(MusicChannel === undefined) MusicChannel = 'None'
            let ModerationRoles = result.ModerationRolesIDs.map(ID => `<@&${ID}>`).join(", ")
            if (ModerationRoles.length === 0) ModerationRoles = "None"
            let MusicRoles = result.MusicRolesIDs.map(ID => `<@&${ID}>`).join(", ")
            if (MusicRoles.length === 0) MusicRoles = "None"
    
            const embed = new RichEmbed()
                .setTitle(`Configuration for ${msg.guild.name}`)
                .setThumbnail(msg.guild.iconURL)
                .setAuthor(this.client.user.username, this.client.user.avatarURL)
                .addField('Server specific prefix', `${result.customPrefix}`)
                .addField('Modlog Channel', ModlogChannel)
                .addField('Starboard Channel', StarboardChannel)
                .addField('Music Channel', MusicChannel)
                .addField('Moderation Roles', ModerationRoles)
                .addField('Music Roles', MusicRoles)
                .setTimestamp()
                .setFooter('Senpai Bot by Yukine');
                await msg.channel.send({embed});
        }else{

        }
    }
}

module.exports = ConfigCommand
