const request               = require('request');
exports.run = (client, msg) => {
    request.get("http://random.cat/meow", function (error, response, body) {
        if(error) {
           console.error(error)
           return;
        }
        var url = body.slice(33, -2);
        msg.reply("here you go enjoy your cat");
        msg.channel.sendFile("http://random.cat/i/" + url);
        console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")") }
        );
}

exports.help = {
    'name': 'Cat',
    'description': 'Shows a random Cat',
    'usage': 'Cat'
}
