const Discord = require('discord.js');
exports.run = (client, msg, args) => {
    function nameTest(channel) {
        return channel.name.toLowerCase().startsWith("log")
    }
     async function kick(member, reason, channel) {
        const message = await channel.send(`trying to kick ${member.user.tag}`)
        const kick = await member.kick(reason)
        const newMessage = await message.edit(`successfully kicked ${member.user.tag}`)
        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setColor(0x00AE86)
            .setTimestamp()
            .addField("Command", "Kick")
            .addField("Member", `${member.user.tag} (${member.user.id})`)
            .addField("Reason", reason)

        if (msg.guild.channels.find(nameTest)) {
            msg.guild.channels.find(nameTest).send({embed})
            } else {
            msg.guild.defaultChannel.send("i dont found a channel that has a name started with log.\nCreate one so my Logs will be seperated from a normal Chat channel!", {embed})
        }
    }
    let reason = args.slice(1).join(' ');
    let member   = msg.mentions.members.first()
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if(!msg.member.hasPermission(2)) return msg.reply("*You need a role that provide the right to kick People!*")
    if (msg.mentions.members.size < 1) return msg.reply('You must mention someone for this Command.')
    if (!member.kickable) return msg.reply('I have no rights to kick that User');
    if (reason.length < 1) return msg.reply('You must supply a reason for the kick.');

    kick(member, reason, msg.channel)
}

exports.help = {
    'name': 'kick',
    'description': 'kicks the mentioned User',
    'usage': 'kick [@user] [reason]'
}

exports.alias = []
