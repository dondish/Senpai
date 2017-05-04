const config                                = require('../config/config.js');
const MALjs                                 = require('MALjs');
const mal                                   = new MALjs(config.MyAnimeListUsername, config.MyAnimeListPassword);
exports.run = (client, msg, params) => {
    if (params.length < 1) return msg.reply('You must add a word to search for');
      mal.manga.search(msg.content.slice(7))
        .then(result => {
          var Mangares = result.manga[0]
          msg.channel.send([
          "**Title JP:**",   Mangares.title,
          "**Title EN:**",   Mangares.english,
          "**Url:**",        "https://myanimelist.net/manga/" + Mangares.id,
          "**Score:**",      Mangares.score,
          "**Type:**",       Mangares.type,
          "**Chapters:**",   Mangares.chapters,
          "**Status:**",     Mangares.status,
          "**Synopsis:**",
          Mangares.synopsis
          ])
        })
        .catch(err => {
          msg.reply("I had a error while trying to fetch the data from MyAnimeList Sorry! But dont blame me, blame the search API from MyAnimeList")
          console.error(err)
        });
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'Manga',
    'description': 'search for an Manga on MyAnimeList',
    'usage': 'Manga [anime]'
}
