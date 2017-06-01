exports.run = (client, msg) => {
    const voiceChannel = msg.member.voiceChannel;
    let voiceConnection = msg.guild.voiceConnection
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if (!voiceChannel) return msg.reply("You must be in a Voice channel to use this Command!")
    if (!voiceChannel.joinable) return msg.reply("I have no rights to join your Voice channel!")
    if (!voiceChannel.speakable) return msg.reply("I have no rights to speak in your Voice channel!")
    if (voiceConnection !== null) return msg.reply(`Im already in a Voice channel on this Server!`)
    voiceChannel.join().catch(console.log)
    msg.channel.send("successful joined your Voice Channel")
}

exports.help = {
    'name': 'join',
    'description': 'Joins a Voice channel to play Music from play',
    'usage': 'join'
}
