exports.run = (client, msg) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    let play = client.commands.get("PLAY");
    play.queue(msg)
}

exports.help = {
    'name': 'queue',
    'description': 'shows the current music queue of this guild',
    'usage': 'queue'
}

exports.alias = ["songs", "playlist", "list"]
