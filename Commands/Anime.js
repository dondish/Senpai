const config                                = require('../config/config.js');
const MALjs                                 = require('MALjs');
const mal                                   = new MALjs(config.MyAnimeListUsername, config.MyAnimeListPassword);
exports.run = (client, msg, params) => {
    if (params.length < 1) return msg.reply('You must add a word to search for');
      mal.anime.search(msg.content.slice(7))
        .then(result => {
          var Animeres = result.anime[0]
          msg.channel.sendMessage([
          "**Title JP:**", Animeres.title,
          "**Title EN:**", Animeres.english,
          "**Url:**",      "https://myanimelist.net/anime/" + Animeres.id,
          "**Score:**",    Animeres.score,
          "**Type:**",     Animeres.type,
          "**Status:**",   Animeres.status,
          "**Episodes:**", Animeres.episodes,
          "**Synopsis:**",
          Animeres.synopsis
          ])
        })
        .catch(err => {
          msg.reply("I had a error while trying to fetch the data from MyAnimeList Sorry! But dont blame me, blame the search API from MyAnimeList")
          console.error(err)
        });
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'Anime',
    'description': 'search for an Anime on MyAnimeList',
    'usage': 'Anime [anime]'
}
