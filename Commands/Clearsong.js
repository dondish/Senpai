exports.run = (client, msg) => {
    var play = client.commands.get("PLAY");
    play.deletesong(msg)
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'clearsong',
    'description': 'delete 1 song from the queue',
    'usage': 'clearsong <queue number>'
}
