exports.run = (client, msg) => {
    msg.channel.send(Math.round(msg.client.ping) + " ms");
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'Ping',
    'description': 'shows the ping of the Bot in ms',
    'usage': 'ping'
}
