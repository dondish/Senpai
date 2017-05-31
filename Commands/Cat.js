const request               = require('request');
exports.run = (client, msg) => {
    request.get("http://random.cat/meow", function (error, response, body) {
        if(error) {
           console.error(error)
           return;
        }
        var url = body.slice(33, -2);
        var file = "http://random.cat/i/" + url
        msg.reply("here you go enjoy your cat");
        msg.channel.send( {file} )  }
        );
}

exports.help = {
    'name': 'Cat',
    'description': 'Shows a random Cat',
    'usage': 'Cat'
}
