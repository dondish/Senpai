const Kitsu                                 = require('kitsu.js');
const kitsu                                 = new Kitsu();
exports.run = (client, msg, params) => {
    if (params.length < 1) return msg.reply('You must add a word to search for');
    msg.channel.send("*fetching information from kitsu!*").then(message => {
    kitsu.searchAnime(params.join(" "))
      .then(result => {
          const filter = message => {
            if(message.content === "1" || message.content === "2" || message.content === "3" || message.content === "4" || message.content === "5") {
              return true
            } else {
              return false
            }
          }
          message.edit(`Okay i found 5 possible matches which do you want to see? (just write the first number, it will be canceled after 60 seconds)\n1: ${result[0].titles.english}/${result[0].titles.japanese}\n2: ${result[1].titles.english}/${result[1].titles.japanese}\n3: ${result[2].titles.english}/${result[2].titles.japanese}\n4: ${result[3].titles.english}/${result[3].titles.japanese}\n5: ${result[4].titles.english}/${result[4].titles.japanese}`)
          msg.channel.awaitMessages(filter, {
              "max": 20,
              "maxMatches": 1,
              "time": 60000,
              "errors": ['time']
              }
            ).then(message => {
                if (message.size === 0) return
                const number = Number(message.first().content) - 1
                msg.channel.send(`**Title JP:** ${result[number].titles.japanese}\n\n**Title English:** ${result[number].titles.english}\n\n**Type:** ${result[number].showType}\n\n**Start Date:** ${result[number].startDate}\n\n**End Date:** ${result[number].endDate} (if this is null then its still in progress)\n\n**PopularityRank:** ${result[number].popularityRank}\n\n**Synopsis:** ${result[number].synopsis}\n**Link:** https://kitsu.io/anime/${result[number].id}`)
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
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'Anime',
    'description': 'search for an Anime on MyAnimeList',
    'usage': 'Anime [anime]'
}
