exports.run = (client, msg) => {
    var play = client.commands.get("PLAY");
    play.queue(msg)
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'queue',
    'description': 'shows the current music queue of this guild',
    'usage': 'queue'
}
