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
    'name': 'cat',
    'description': 'shows a random cat',
    'usage': 'cat'
}

exports.alias = ["pussy"]
