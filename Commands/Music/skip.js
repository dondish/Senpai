const music = require('../../Util/music.js')
exports.run = (client, msg) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    music.skip(msg)
}

exports.help = {
    'name': 'skip',
    'description': 'skips the current playing song from the bot',
    'usage': 'skip'
}

exports.alias = ["next"]
