exports.run = (client, msg) => {
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
