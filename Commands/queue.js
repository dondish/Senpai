exports.run = (client, msg) => {
    var play = client.commands.get("PLAY");
    play.queue(msg)
}

exports.help = {
    'name': 'queue',
    'description': 'shows the current music queue of this guild',
    'usage': 'queue'
}
