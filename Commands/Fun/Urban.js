const urban       = require('relevant-urban');
exports.run = (client, msg, params) => {
    let InputUrban = msg.content.slice(7)
    if (params.length < 1) return msg.reply('You must add a word to search for');
     urban.random(InputUrban)
      .then(result => {
        msg.channel.send([
          `**${result.word}** by ${result.author}`,
          ``,
          `***Definition:***`,
          `${result.definition}`,
          ``,
          `***Example***`,
          `${result.example}`,
          ``,
          `${result.thumbsUp} :thumbsup:`,
          ``,
          `${result.thumbsDown} :thumbsdown:`
        ])
      })
      .catch(() => {
        msg.channel.send("Seems like i didn't find anything on urban dictonary that match your word/s")
      })
}

exports.help = {
    'name': 'urban',
    'description': 'search for a word on the urban dictonary',
    'usage': 'urban [word]'
}

exports.alias = []
