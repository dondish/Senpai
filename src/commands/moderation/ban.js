const Commands = require('../../structures/new/Command.js')
const {RichEmbed} = require('discord.js')
const info = {
    "name": "ban",
    "description": "bans the mentioned user",
    "aliases": ["banne", "banhammer"],
    "examples": ["ban @User annoying", "ban @user spamming"]
}

class BanCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg, params) {
        const permissionLevel = await msg.member.getPermissionsLevel(this.client)
        if(permissionLevel >= 3) return msg.reply("You dont have permission to use this Command!")
        if (msg.mentions.members.size < 1) return msg.reply('You must mention someone for this Command.')
        let member = msg.mentions.members.first()
        if (!member.bannable) return msg.reply('I have no rights to ban that User');
        if(msg.member.highestRole.comparePositionTo(member.highestRole) <= 0 && msg.guild.owner.id !== msg.author.id) return msg.reply("You can't ban someone with an higher or the same roleposition!")
        let reason = params.slice(1).join(' ');
        if (reason.length < 1) return msg.reply('You must supply a reason for the ban.');
        const message = await msg.channel.send(`trying to ban ${member.user.tag}`)
        try{
            await member.ban({
                reason,
                "days": 7
            })
            await message.edit(`successfully banned ${member.user.tag}`)
            await member.addBan(this.client, reason)
            const guildsettings = await msg.guild.getConfig(this.client)
            const embed = new RichEmbed()
                .setAuthor(msg.author.username, msg.author.avatarURL)
                .setColor(0x00AE86)
                .setTimestamp()
                .addField("Action", "Ban")
                .addField("Target", `${member.user.tag} (${member.user.id})`)
                .addField("Reason", reason)
            if(guildsettings.modlogID !== "None") msg.guild.channels.get(guildsettings.modlogID).send({embed})
        }catch(error){
            message.channel.send(`i had an error!`)
        }
    }
}

module.exports = BanCommand
