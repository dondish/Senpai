exports.run = (client, msg) => {
    let play = client.commands.get("PLAY");
    play.queue(msg)
}

exports.help = {
    'name': 'queue',
    'description': 'shows the current music queue of this guild',
    'usage': 'queue'
}

exports.alias = ["songs", "playlist", "list"]
