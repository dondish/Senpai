const config                                = require('../config/config.js')
exports.run = (client, msg, args) => {
    var play = client.commands.get("PLAY");
    if(args.length > 1) return msg.reply("You must add the number of the Song which you wanna remove!")
    var number = parseInt(args[0], 10)
    if (number === 1) return msg.reply(`You try to delete the current playing song from the queue use ${config.prefix}skip instead`)
    play.deletesong(msg, number)
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'removesong',
    'description': 'delete 1 song from the queue',
    'usage': 'removesong <queue number>'
}
