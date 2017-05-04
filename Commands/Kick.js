exports.run = (client, msg, args) => {
    let reason = args.slice(1).join(' ');
    let user   = msg.mentions.users.first()
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if(!msg.member.hasPermission(2)) return msg.reply("*You need a role that provide the right to kick People!*")
    if (msg.mentions.users.size < 1) return msg.reply('You must mention someone for this Command.')
    if (!msg.guild.member(user).kickable) return msg.reply('I have no rights to kick that User');
    if (reason.length < 1) return msg.reply('You must supply a reason for the kick.');
    msg.guild.member(user).kick()
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
    msg.guild.defaultChannel.send(  {
    "embed": {
        "color": 0x00AE86,
        "timestamp": new Date(),
        "fields": [{
        "name": 'Command',
        "value": 'kick'
        },
        {
        "name": 'User',
        "value": `${user.tag} (${user.id})`
        },
        {
        "name": 'Modrator/Admin',
        "value": `${msg.author.tag}`
        },
        {
        "name": 'Reason',
        "value": reason
        }
        ]
}
} )

}

exports.help = {
    'name': 'kick',
    'description': 'kicks the mentioned User',
    'usage': 'kick [@user] [reason]'
}
