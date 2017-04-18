/*
 Author:          Yukine
 AuthorID:        184632227894657025
 Version:         2.62
 Description:     This is Discord Bot based on nodejs and discord.js
                  and named after my love to Anime :3

*/

const Discord     = require('discord.js');
const request     = require('request');
const urban       = require('urban');
const mal         = require('maljs');
const config      = require('./config/config.js');
const osu         = require('node-osu');
const osuApi      = new osu.Api(config.OsuToken);
const bot         = new Discord.Client();
const LoginToken  = config.BotToken;
const prefix      = config.prefix;
const Version     = "2.62"

//ready function
bot.on('ready' , () => {
  console.log('-----------------------------------------------------------------------------');
  console.log('Username:      ' + bot.user.username);
  console.log('ID:            ' + bot.user.id);
  console.log('Servers:       ' + bot.guilds.size );
  console.log('Channels:      ' + bot.channels.size);
  console.log('-----------------------------------------------------------------------------');
  bot.user.setGame("%help")
});
//event listener message
bot.on('message' , msg => {

  let responseObject = {
    "DANKMEMES": "https://cdn.discordapp.com/attachments/190967860070318080/203724153767985152/7ead62afdd1514fde3e19ba5ffc66728c092c9acf65137327491a29fc57f2932_1.gif",
    "KAPPA"    : "https://puu.sh/uNpB8/aa6908a2de.png",
    "KAPPAHD"  : "https://puu.sh/vnJLh/496413df0a.png",
    "DATBOI"   : "https://lh3.googleusercontent.com/YaEeYfc89GKs0YygNigS33golgVvTiPzqklKcg_OUrcdNt4n5pAokeGPFfIhoGOji6-BLlfi=s640-h400-e365",
  };
  var input          = msg.content.toUpperCase() ;
  var Input8Ball     = msg.content.slice(7);
  var things         = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
  var poop ;
  var Ping           = bot.ping;
  const args         = msg.content.split(" ").slice(1);
  const embed        = new Discord.RichEmbed()

  if (msg.author.bot) return;

  function log(special){
    if(undefined != special){
      console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")", special)
      return;
    } else {
      console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
      return;
    }
  }

function error(error){
  console.log("[Error]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")", error)
  msg.channel.sendMessage("Sorry i had a Error while executing this command please try again and if this happen again please contact my Programmer")
  }

  if(msg.content.startsWith(prefix))
  {
        if(responseObject[msg.content.slice(1).toUpperCase()]) {
          msg.channel.sendFile(responseObject[msg.content.slice(1).toUpperCase()]);
          log()
        }
      }


  if(input.startsWith(prefix + "EVAL"))
  {
    if(msg.author.id == "184632227894657025")
    {
      function clean(text) {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
          }
    if (msg.content.startsWith(prefix + "eval")) {
      try {
        var code = args.join(" ");
        var evaled = eval(code);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
          msg.channel.sendCode("xl", clean(evaled));
          } catch (err) {
            msg.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }
    }
    }else {
      msg.channel.sendMessage("Because of security measures, only the owner can execute this command!")
    }
  }


  if(input ===prefix + "HELP")
  {
    msg.channel.sendMessage("i sent you a PM");
    log()
    msg.author.sendMessage([
      "```markdown",
`      Notice Me
                 #I will notice you :3

      ${prefix}Cat
                 #Show you a random sweet cat

      ${prefix}8ball
                 #Ask me a Question and i answer

      ${prefix}Ping
                 #Shows my ping in ms

      ${prefix}Fgt
                 #Shows a Copy&Paste

      ${prefix}Kappa
                 #Shows a Kappa

      ${prefix}KappaHD
                 #Shows a HD Kappa

      ${prefix}Ban [@User]
                 #Ban a user if you have a role with the BAN_MEMBER right

      ${prefix}Kick [@User]
                 #Kick a user if you have a role with the KICK_MEMBER right

      ${prefix}Urban [word]
                 #Search for a word on urban Urban Dictionary

      ${prefix}Anime [Anime Name]
                 #Search for a Anime on myanimelist

      ${prefix}Manga [Manga Name]
                 #Search for a Manga on myanimelist

      ${prefix}Coinflip [Head/Number]
                 #Do a coinflip

      ${prefix}Cookie @[User]
                 #Give someone a Cookie`,
      "```"
    ]);
  }




  if(input ===prefix + "CAT")
  {
    request.get("http://random.cat/meow", function (error, response, body) {
           if(error) {
                   error(error)
                   return;
               }
               var url = body.slice(33, -2);
               msg.reply("here you go enjoy your cat");
               msg.channel.sendFile("http://random.cat/i/" + url);
               log()
                                                                          }
              );
  }

  if(input.startsWith(prefix + "8BALL")) {
    if(input ===prefix + "8BALL") {
        msg.reply(prefix + "8ball is for questions so please add a question behind.");
                                  }
                     else
          {
            poop = ("You ask me `" + Input8Ball + "` and my answer is: **" + things[Math.floor(Math.random()*things.length)] + "**");
            msg.reply(poop);
            log()
          }
                                        }
  if(input ===prefix + "PING")
    {
      msg.channel.sendMessage(Math.round(Ping) + " ms");
      log()
    }

  if(input.startsWith(prefix + "COINFLIP"))
  {
    function coinFlip() {
    return Math.floor(Math.random() * 2);
    }
    if(input ===prefix + "COINFLIP")
    {
      msg.channel.sendMessage("You can only use coinflip if you add Head/Number behind it!")
    }else{
      var inputcoin = input.slice(10);
      if(inputcoin === 'HEAD' || inputcoin === 'NUMBER')
     {
        var convertcoin
        if(inputcoin === 'Head')
        {
          convertcoin = 1
        }else{
          convertcoin = 0
        }
        if(coinFlip() === convertcoin)
        {
          msg.channel.sendMessage("You won :heart:")
        }else{
          msg.channel.sendMessage("You lost Feelsbadman")
        }
     }else{
       msg.channel.sendMessage("You can only choose Head or Number!")
     }
    }
    log()
  }


  if(input ===prefix + "FGT")
      {
        msg.reply( [
      `
███████╗░█████╗░░██████╗░░██████╗░░██████╗░████████╗
██╔════╝██╔══██╗██╔════╝░██╔════╝░██╔═══██╗╚══██╔══╝
█████╗░░███████║██║░░███╗██║░░███╗██║░░░██║░░░██║░░░
██╔══╝░░██╔══██║██║░░░██║██║░░░██║██║░░░██║░░░██║░░░
██║░░░░░██║░░██║╚██████╔╝╚██████╔╝╚██████╔╝░░░██║░░░
╚═╝░░░░░╚═╝░░╚═╝░╚═════╝░░╚═════╝░░╚═════╝░░░░╚═╝░░░`
                    ]
                  );
                  log()
     }
 if(msg.channel.type === "text")
 {
  if(input.startsWith(prefix + "BAN"))
    {
      if(msg.member.hasPermission(4))
        {
          var id    = msg.mentions.users
          msg.guild.ban(id.first())
          msg.channel.sendMessage("**I've Banned:hammer: " + id.first() + " because **<@" + msg.author.id + ">** want it**")
          log()
        }else{
          msg.reply("*You need a role that provide the right to ban People!*")
          log("No Rights")
        }
    }

   if(input.startsWith(prefix + "KICK"))
     {
       if(msg.member.hasPermission(2))
         {
            var id = msg.mentions.users
            msg.guild.member(id.first()).kick()
            msg.channel.sendMessage("**I've Kicked " + id.first() + " because " + msg.author + " want it**")
            log()
         }else{
            msg.reply("*You need a role that provide the right to kick People*")
            log("No Rights")
         }
     }
  }


  if(input.startsWith(prefix + "COOKIE"))
  {
    var id = msg.mentions.users
    msg.channel.sendMessage(`**${id.first()} got a :cookie: from ${msg.author}**`)
    log()
  }

  if(input.startsWith(prefix + "URBAN"))
   if(input ===prefix + "URBAN")
   {
     msg.reply("You must add a word after " + prefix + "Urban")
   }else{
      var InputUrban = urban(msg.content.slice(7))
      InputUrban.first(function(OutputUrban) {
        msg.channel.sendMessage([
          `**${OutputUrban.word}** by ${OutputUrban.author}`,
          ``,
          `***Definition:***`,
          `${OutputUrban.definition}`,
          ``,
          `***Example***`,
          `${OutputUrban.example}`,
          ``,
          `${OutputUrban.thumbs_up} :thumbsup:`,
          ``,
          `${OutputUrban.thumbs_down} :thumbsdown:`
        ])
        log()
      }
    );
    }

    if(input.startsWith(prefix+ "MANGA"))
     if(input ===prefix + "MANGA")
     {
       msg.reply("You must add a Manga name after " + prefix + "Manga")
       log()
     }else{
       var InputMAL = msg.content.slice(7)
       mal.quickSearch(InputMAL).then(function (results) {
         results.manga[0].fetch().then(function (results2) {
             msg.channel.sendMessage(     [
               "**Title:** "                         + results2.title,
               "**Url:** https://myanimelist.net"    + results2.path,
               "**Score:**"                          + results2.score,
               "**Rank:**"                           + results2.ranked,
               "**Popularity:**"                     + results2.popularity,
               "**Synapse:**",
               results2.description,
             ]);


         }
       );
       }
      );
      log()
     }


  if(input.startsWith(prefix+ "ANIME"))
   if(input ===prefix + "ANIME")
   {
     msg.reply("You must add a Anime name after " + prefix + "Anime")
     log()
   }else{
     msg.channel.sendMessage("Im fetching the Information from MyAnimeList...")
     var InputMAL = msg.content.slice(7)
     mal.quickSearch(InputMAL).then(function (results) {
       results.anime[0].fetch().then(function (results2) {
         msg.channel.sendMessage(     [
           "**Title:** "                         + results2.title,
           "**Url:** https://myanimelist.net"    + results2.path,
           "**Score:**"                          + results2.score,
           "**Rank:**"                           + results2.ranked,
           "**Popularity:**"                     + results2.popularity,
           "**Synapse:**",
           results2.description,
         ]);
     }
     );
     }
    );
    log()
   }


}
);

bot.login(LoginToken);
