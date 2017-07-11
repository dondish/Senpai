const music = require('../../Util/music.js')
exports.run = (client, msg) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    music.shufflequeue(msg)
}

exports.help = {
    'name': 'shuffle',
    'description': 'shuffle the current playlist from the bot',
    'usage': 'shuffle'
}

exports.alias = []
