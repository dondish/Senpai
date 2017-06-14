exports.run = (client, msg) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    let play = client.commands.get("PLAY");
    play.clearqueue(msg)
    msg.channel.send("I've cleared the whole queue")
}

exports.help = {
    'name': 'clearqueue',
    'description': 'clears the whole music queue of me on this server',
    'usage': 'clearqueue'
}

exports.alias = []
