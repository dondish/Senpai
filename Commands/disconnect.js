exports.run = (client, msg) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    const voiceConnection = msg.guild.voiceConnection
    var play = client.commands.get("PLAY");
    play.disconnect(msg)
    if (voiceConnection === null) return msg.reply("im not in a Voice Channel!")
    voiceConnection.disconnect()
    msg.channel.send("By By :wave:")

    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'disconnect',
    'description': 'leave a Voice channel',
    'usage': 'leave'
}
