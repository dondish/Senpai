exports.run = (client, msg) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    let play = client.commands.get("PLAY");
    play.shufflequeue(msg)
}

exports.help = {
    'name': 'shuffle',
    'description': 'shuffle the current playlist from the bot',
    'usage': 'shuffle'
}

exports.alias = []
