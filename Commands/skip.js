exports.run = (client, msg) => {
    var play = client.commands.get("PLAY");
    play.skip(msg)
}

exports.help = {
    'name': 'skip',
    'description': 'skips the current playing song from the bot',
    'usage': 'skip'
}
