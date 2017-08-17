const Commands = require('../../structures/new/Command.js')
const {Collection} = require('discord.js')
const Kitsu = require('kitsu.js');
const kitsu = new Kitsu()
const info = {
    "name": "anime",
    "description": "search for an Anime on kitsu!",
    "aliases": [],
    "examples": ["anime Attack on Titan", "anime shingeki no kyojin"]
}

class AnimeCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg, params) {
        function filter(message) {
            if(message.author.id !== msg.author.id) return false
                if(message.content === "1" || message.content === "2" || message.content === "3" || message.content === "4" || message.content === "5") {
                  return true
                } else {
                  return false
                }
        }
        if (params.length < 1) return msg.reply('You must add a anime to search for');
        const message = await msg.channel.send("*fetching information from kitsu!*")
        try{
            const result = await kitsu.searchAnime(params.join(" "))
            message.edit(`Okay i found 5 possible matches which do you want to see? (just write the first number, it will be canceled after 60 seconds)\n1: ${result[0].titles.english}/${result[0].titles.japanese}\n2: ${result[1].titles.english}/${result[1].titles.japanese}\n3: ${result[2].titles.english}/${result[2].titles.japanese}\n4: ${result[3].titles.english}/${result[3].titles.japanese}\n5: ${result[4].titles.english}/${result[4].titles.japanese}`)
            const collected = await msg.channel.awaitMessages(filter, {
                "max": 20,
                "maxMatches": 1,
                "time": 60000,
                "errors": ['time']
                })
            const number = Number(collected.first().content) - 1
            await msg.channel.send(`**Title JP:** ${result[number].titles.japanese || 'same as English'}\n**Title English:** ${result[number].titles.english || 'same as Japanese'}\n**Type:** ${result[number].showType}\n**Start Date:** ${result[number].startDate}\n**End Date:** ${result[number].endDate || 'in Progress'}\n**PopularityRank:** ${result[number].popularityRank}\n**Link:** <https://kitsu.io/anime/${result[number].id}>\n**Synopsis:** ${result[number].synopsis}`)
        }catch(error){
            if(error instanceof Collection) return msg.reply("command canceled due timer")
            await message.edit("I had a error while trying to fetch the data from Kitsu Sorry! did you spell the Anime name right?")
            await msg.react("❓")
        }
    }
}

module.exports = AnimeCommand
