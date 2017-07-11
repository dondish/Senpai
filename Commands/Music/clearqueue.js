const music = require('../../Util/music.js')
exports.run = (client, msg) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    music.clearqueue(msg)
    msg.channel.send("I've cleared the whole queue")
}

exports.help = {
    'name': 'clearqueue',
    'description': 'clears the whole music queue of me on this server',
    'usage': 'clearqueue'
}

exports.alias = []
