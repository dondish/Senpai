const config                                = require('../config/config.js')
exports.run = (client, msg, args) => {
    var play = client.commands.get("PLAY");
    if(args.length > 1) return msg.reply("You must add the number of the Song in the queue")
    var number = parseInt(args[0], 10)
    if (number === 1) return msg.reply(`You try to delete the current playing song from the queue use ${config.prefix}skip!`)
    play.deletesong(msg, number)
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'clearsong',
    'description': 'delete 1 song from the queue',
    'usage': 'clearsong <queue number>'
}
