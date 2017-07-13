const snekfetch             = require('snekfetch')
exports.run = (client, msg) => {
        snekfetch.get("http://random.cat/meow")
            .then(respond => {
              const Link = respond.body.file
                msg.channel.send("here you go enjoy your cat", {"files": [Link]})
            })
}

exports.help = {
    'name': 'cat',
    'description': 'shows a random cat',
    'usage': 'cat'
}

exports.alias = ["pussy"]
