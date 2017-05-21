const   osu         = require('node-osu');
const   config      = require('../config/config.js');
var     osuApi      = new osu.Api(config.OsuToken, {
    "notFoundAsError": true,
    "completeScores": false
})
exports.run = (client, msg, args) => {
    const type = args[0]
    msg.channel.send("*Okay, im fetching the Data from Osu!*").then(message => {
            if(type.toLowerCase() === "user") {
                osuApi.getUser({"u": args[1]}).then(user => {
                        message.edit(`**User:** ${user.name}\n\n**ID:** ${user.id}\n\n**Country:** ${user.country}\n\n**User Level:** ${user.level}\n\n**Accuracy:** ${user.accuracyFormatted}\n\n**Counts**: \n**SS:** ${user.counts.SS}\n**S:** ${user.counts.S}\n**A:** ${user.counts.A}\n\n`)
                    }
                )
                .catch( () => {
                        message.edit("Something went wrong! did you Spell the Username right?").then(message => message.delete(10000))
                    }
                )
            }else if(type.toLowerCase() === "map") {
                osuApi.getBeatmaps({"b": args[1]}).then(maps => {
                        const BeatmapObject = maps[0]
                        message.edit(`**Title:** ${BeatmapObject.title}\n\n**Creator:** ${BeatmapObject.creator}\n\n**Genre:** ${BeatmapObject.genre}\n\n**Language:** ${BeatmapObject.language}\n\n**Status:** ${BeatmapObject.approvalStatus}`)
                    }
                )
                .catch( () => {
                        message.edit("Something went wrong! is the map id right?").then(message => message.delete(10000))
                    }
                )
            } else {
            message.edit("Oh i dont think your Syntax is right i only accept User or Map as first argument").then(message => message.delete(10000))
            }
        }
    )
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'Osu',
    'description': 'shows the stats of an Osu! player or map',
    'usage': 'Osu [user/map] [username/beatmapid]'
}
