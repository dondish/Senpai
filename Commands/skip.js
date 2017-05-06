exports.run = (client, msg) => {
    var play = client.commands.get("PLAY");
    play.skip(msg)
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'skip',
    'description': 'skips the current playing song from the bot',
    'usage': 'skip'
}
