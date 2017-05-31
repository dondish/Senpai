exports.run = (client, msg, args) => {
    let reason = args.slice(1).join(' ');
    let user   = msg.mentions.users.first()
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if(!msg.member.hasPermission(4)) return msg.reply("*You need a role that provide the right to ban People!*")
    if (msg.mentions.users.size < 1) return msg.reply('You must mention someone for this Command.')
    if (!msg.guild.member(user).bannable) return msg.reply('I have no rights to ban that User');
    if (reason.length < 1) return msg.reply('You must supply a reason for the ban.');
    msg.guild.ban(user)
    msg.guild.defaultChannel.send( {
    "embed": {
        "color": 0x00AE86,
        "timestamp": new Date(),
        "fields": [{
        "name": 'Command',
        "value": 'Ban'
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
        })

}

exports.help = {
    'name': 'Ban',
    'description': 'Bans the mentioned User',
    'usage': 'Ban [@user] [reason]'
}
