const snekfetch = require('snekfetch')
exports.run = (client, msg) => {
        snekfetch.get("https://dog.ceo/api/breeds/image/random")
            .then(respond => {
              const Link = respond.body.message
              if(respond.body.status !== "success") return msg.channel.send('The website for the API request had an error sorry :c')
                msg.channel.send("enjoy your dog", {"files": [Link]})
            })
}

exports.help = {
    'name': 'dog',
    'description': 'shows a random dog',
    'usage': 'dog'
}

exports.alias = ["doggo"]
