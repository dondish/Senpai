const Discord = require('discord.js');
exports.run = (client, msg, args) => {
    function nameTest(channel) {
        return channel.name.toLowerCase().startsWith("log")
    }
     async function banAndUnban(member, reason, channel) {
        const message = await channel.send(`trying to softban ${member.user.tag}`)
        const ban = await member.ban({
                reason,
                "days": 7
        })
        const newMessage = await message.edit(`successfully banned ${member.user.tag} Awaiting unban ...`)
        const unban = await member.guild.unban(ban.user)
        const newMessage2 = await newMessage.edit(`successfully softbanned ${unban.tag}`)
        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setColor(0x00AE86)
            .setTimestamp()
            .addField("Command", "Softban")
            .addField("Member", `${member.user.tag} (${member.user.id})`)
            .addField("Reason", reason)

        if (msg.guild.channels.find(nameTest)) {
            msg.guild.channels.find(nameTest).send({embed})
            .catch(() => msg.author.send(`I have no rights to write in the channel called ${msg.guild.channels.find(nameTest).name} so i can't write my Logs there when im used with Admin/Moderational commands\nPlease considering changing that in the Future so you have nice Logs form me there`))
            } else {
            msg.guild.defaultChannel.send("i dont found a channel that has a name started with log.\nCreate one so my Logs will be seperated from a normal Chat channel!", {embed})
            .catch(() => msg.author.send("i have no rights to write in your defaultChannel so i dm you with that information\nYou should create a Channel called 'logs' because i would automatically send my logs there when my Moderation tools are used\n"))
        }
    }
    let reason = args.slice(1).join(' ');
    let member   = msg.mentions.members.first()
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if(!msg.member.hasPermission(4)) return msg.reply("*You need a role that provide the right to ban/unban People!*")
    if (msg.mentions.members.size < 1) return msg.reply('You must mention someone for this Command.')
    if (!member.bannable) return msg.reply('I have no rights to ban/unban that User');
    if (reason.length < 1) return msg.reply('You must supply a reason for the softban.');

    banAndUnban(member, reason, msg.channel)
}

exports.help = {
    'name': 'softban',
    'description': 'bans a mentioned Member and unban him after that so all of his messages in the last 7 days are deleted',
    'usage': 'softban [@User] [reason]'
}

exports.alias = ["softbanne"]
