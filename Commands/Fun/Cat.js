const snekfetch             = require('snekfetch')
exports.run = (client, msg) => {
        snekfetch.get("http://random.cat/meow")
            .then(respond => {
              const Link = respond.body.file
                msg.reply("here you go enjoy your cat")
                msg.channel.send({"files": [Link]})
            })
}

exports.help = {
    'name': 'Cat',
    'description': 'Shows a random Cat',
    'usage': 'Cat'
}

exports.alias = ["pussy"]
