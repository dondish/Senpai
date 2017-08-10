const Kitsu                                 = require('kitsu.js');
const kitsu                                 = new Kitsu();
exports.run = (client, msg, params) => {
    if (params.length < 1) return msg.reply('You must add a word to search for');
    msg.channel.send("*fetching information from kitsu!*").then(message => {
    kitsu.searchManga(params.join(" "))
      .then(result => {
          function filter(message) {
            if(message.author.id !== msg.author.id) return false
            if(message.content === "1" || message.content === "2" || message.content === "3" || message.content === "4" || message.content === "5") {
              return true
            } else {
              return false
            }
          }
          message.edit(`Okay i found 5 possible matches which do you want to see? (just write the first number, it will be canceled after 60 seconds)\n1: ${result[0].titles.enJp}\n2: ${result[1].titles.enJp}\n3: ${result[2].titles.enJp}\n4: ${result[3].titles.enJp}\n5: ${result[4].titles.enJp}`)
          msg.channel.awaitMessages(filter, {
              "max": 20,
              "maxMatches": 1,
              "time": 60000,
              "errors": ['time']
              }
            ).then(message => {
                if (message.size === 0) return
                const number = Number(message.first().content) - 1
                msg.channel.send(`**Title EN/JP:** ${result[number].titles.enJp}\n**Type:** ${result[number].subType}\n**Start Date:** ${result[number].startDate}\n**End Date:** ${result[number].endDate || 'in Progress'}\n**PopularityRank:** ${result[number].popularityRank}\n**Link:** <https://kitsu.io/manga/${result[number].id}>\n**Synopsis:** ${result[number].synopsis}`)
              }
            )
            .catch(() => msg.reply("Command canceled due Timer"))

        }
      )
      .catch(() => {
          message.edit("I had a error while trying to fetch the data from Kitsu Sorry! did you spell the Anime name right?")
          msg.react("❓")
          }
        );
      }
    )
}

exports.help = {
    'name': 'manga',
    'description': 'search for an manga on kitsu',
    'usage': 'manga [manga]'
}

exports.alias = []
