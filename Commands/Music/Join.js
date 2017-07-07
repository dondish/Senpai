exports.run = (client, msg) => {
    const voiceChannel = msg.member.voiceChannel;
    let voiceConnection = msg.guild.voiceConnection
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if (!voiceChannel) return msg.reply("You must be in a Voice channel to use this Command!")
    if (!voiceChannel.joinable) return msg.reply("I have no rights to join your Voice channel!")
    if (!voiceChannel.speakable) return msg.reply("I have no rights to speak in your Voice channel!")
    if (voiceConnection !== null) return msg.reply(`Im already in a Voice channel on this Server!`)
    voiceChannel.join().then(() => {
    msg.channel.send("successfull joined your Voice Channel")
    })
    .catch(console.log)
}

exports.help = {
    'name': 'join',
    'description': 'joins a voice channel to play music',
    'usage': 'join'
}

exports.alias = ["summon"]
