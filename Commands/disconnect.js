exports.run = (client, msg) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    const voiceConnection = msg.guild.voiceConnection
    if (voiceConnection === null) return msg.reply("im not in a Voice Channel!")
    msg.channel.send("By By :wave:")
    voiceConnection.disconnect()
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'disconnect',
    'description': 'leave a Voice channel',
    'usage': 'leave'
}
