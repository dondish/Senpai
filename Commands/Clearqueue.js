exports.run = (client, msg) => {
    var play = client.commands.get("PLAY");
    play.clearqueue(msg)
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'clearqueue',
    'description': 'clears the whole Music queue of me on this server',
    'usage': 'clearqueue'
}
