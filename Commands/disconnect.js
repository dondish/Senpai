exports.run = (client, msg) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    const voiceConnection = msg.guild.voiceConnection
    if (voiceConnection === null) return msg.reply("im not in a Voice Channel!")
    var play = client.commands.get("PLAY");
    play.disconnect(msg)
    voiceConnection.disconnect()
    msg.channel.send("By By :wave:")

}

exports.help = {
    'name': 'disconnect',
    'description': 'leave a Voice channel',
    'usage': 'leave'
}
