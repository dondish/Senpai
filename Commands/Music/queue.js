const music = require('../../Util/music.js')
exports.run = (client, msg) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    music.queue(msg)
}

exports.help = {
    'name': 'queue',
    'description': 'shows the current music queue of this guild',
    'usage': 'queue'
}

exports.alias = ["songs", "playlist", "list"]
