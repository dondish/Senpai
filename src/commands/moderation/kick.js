const Commands = require('../../structures/new/Command.js')
const {RichEmbed} = require('discord.js')
const info = {
    "name": "kick",
    "description": "kicks the mentioned user",
    "aliases": [],
    "examples": ["kick @User annoying", "kick @user spamming"]
}

class KickCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg, params) {
        const permissionLevel = await msg.member.getPermissionsLevel(this.client)
        if(permissionLevel >= 3) return msg.reply("You dont have permission to use this Command!")
        if (msg.mentions.members.size < 1) return msg.reply('You must mention someone for this Command.')
        let member = msg.mentions.members.first()
        if (!member.kickable) return msg.reply('I have no rights to kick that User');
        if(msg.member.highestRole.comparePositionTo(member.highestRole) <= 0 && msg.guild.owner.id !== msg.author.id) return msg.reply("You can't kick someone with an higher or the same roleposition!")
        let reason = params.slice(1).join(' ');
        if (reason.length < 1) return msg.reply('You must supply a reason for the kick.');
        const message = await msg.channel.send(`trying to kick ${member.user.tag}`)
        try{
            await member.kick({reason})
            await message.edit(`successfully kicked ${member.user.tag}`)
            const guildsettings = await msg.getConfig(this.client)
            const embed = new RichEmbed()
                .setAuthor(msg.author.username, msg.author.avatarURL)
                .setColor(0x00AE86)
                .setTimestamp()
                .addField("Command", "kick")
                .addField("Member", `${member.user.tag} (${member.user.id})`)
                .addField("Reason", reason)
            if(guildsettings.modlogID !== "None") msg.guild.channels.get(guildsettings.modlogID).send({embed})
        }catch(error){
            message.channel.send(`i had an error!`)
        }
    }
}

module.exports = KickCommand
