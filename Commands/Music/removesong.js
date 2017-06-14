const config                                = require('../../config/config.json')
exports.run = (client, msg, args) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    let play = client.commands.get("PLAY");
    if(args.length > 1) return msg.reply("You must add the number of the Song which you wanna remove!")
    let number = parseInt(args[0], 10)
    if (number === 1) return msg.reply(`You try to delete the current playing song from the queue use ${config.prefix}skip instead`)
    if (isNaN(number)) return msg.reply("I only accpet the queue number in this command")
    play.deletesong(msg, number)
}

exports.help = {
    'name': 'removesong',
    'description': 'delete 1 song from the queue',
    'usage': 'removesong <queue number>'
}

exports.alias = ["deletesong"]
