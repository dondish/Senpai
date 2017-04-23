exports.run = (client, msg) => {
    if (msg.mentions.users.first().size < 1) return msg.reply('You must mention someone for this Command.')
    msg.channel.sendMessage(`**${msg.mentions.users.first()} got a :cookie: from ${msg.author}**`)
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'Cookie',
    'description': 'Give someone a Cookie',
    'usage': 'Cookie [@User]'
}
