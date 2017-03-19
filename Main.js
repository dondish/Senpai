/*
 Author:          Fr3akGam3r
 AuthorID:        184632227894657025
 Version:         2.6
 Description:     This is Discord Bot based on nodejs and discord.js ,
                  and named after my love to Anime :3,

*/
"use strict";
const Discord = require('discord.js');
const request = require('request');
const urban   = require('urban')
const config  = require('./config/config.js');
const bot     = new Discord.Client();
const Token   = config.Token;
const prefix  = config.prefix;
var log =       "[Command]                   ";
var info =      "[Info]                      ";
var logerror =  "[Error]                     ";

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

  var input        = msg.content.toUpperCase() ;
  var Eingabe8Ball = msg.content.slice(7);
  var things       = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
  var poop ;
  var Ping         = bot.ping;

  if(input ===prefix + "HELP")
  {
    msg.channel.sendMessage("i sent you a PM")
    msg.author.sendMessage([
      `**${prefix}Cat**                  show you a random cat                                                        `,
      `**${prefix}8ball**                ask me a Question and i answer                                               `,
      `**Notice Me**                     i will notice you :3                                                         `,
      `**${prefix}ping**                 shows my ping in ms                                                          `,
      `**${prefix}fgt**                  shows a copy&paste                                                           `,
      `**${prefix}Kappa**                shows a Kappa                                                                `,
      `**${prefix}KappaHD**              shows a HD Kappa                                                             `,
      `**${prefix}Ban @[User]**          ban a user if you have a role with the BAN_MEMBER right                      `,
      `**${prefix}kick @[User]**         kicks a user if you have a role with the KICK_MEMBER right                   `,
      `**${prefix}urban [word]**         search for a word on urban Urban Dictionary                                  `
    ]);
  }




  if(input ===prefix + "CAT")
  {
    request.get("http://random.cat/meow", function (error, response, body) {
           if(error) {
                   console.log(logerror + msg.author.username + "/" + msg.author.id + " error while try to request from http://random.cat/meow");
                   msg.channel.sendMessage("error while get your Cat Picture");
                   return;
               }
               var url = body.slice(33, -2);
               msg.reply("here you go enjoy your cat");
               msg.channel.sendMessage("http://random.cat/i/" + url);
               console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "cat)");
                                                                          }
              );
  }

  if(input.startsWith(prefix + "8BALL")) {
    if(input ===prefix + "8BALL") {
        msg.reply(prefix + "8ball is for questions so please add a question behind.");
                                  }
                     else
          {
            poop = ("You ask me `" + Eingabe8Ball + "` and my answer is: **" + things[Math.floor(Math.random()*things.length)] + "**");
            msg.reply(poop);
            console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "8ball)");
          }
                                        }

  if(input ===prefix + "DANKMEMES")
      {
        msg.channel.sendFile("https://cdn.discordapp.com/attachments/190967860070318080/203724153767985152/7ead62afdd1514fde3e19ba5ffc66728c092c9acf65137327491a29fc57f2932_1.gif");
        console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "dankmemes)");
      }

  if(input.startsWith("NOTICE ME"))
     {
        msg.reply("I do :heart:");
        console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "Notice me)");
     }

  if(input ===prefix + "DATBOI")
     {
       msg.channel.sendMessage("HERE COME DAT BOI");
       msg.channel.sendMessage("https://lh3.googleusercontent.com/YaEeYfc89GKs0YygNigS33golgVvTiPzqklKcg_OUrcdNt4n5pAokeGPFfIhoGOji6-BLlfi=s640-h400-e365");
     console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "datboi)");
     }

  if(input ===prefix + "PING")
    {
      msg.channel.sendMessage(Math.round(Ping) + " ms");
      console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "ping)");
    }


  if(input ===prefix + "KAPPA")
    {
      msg.channel.sendFile("https://puu.sh/uNpB8/aa6908a2de.png");
      console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "kappa)");
    }

  if(input ===prefix + "KAPPAHD")
    {
    msg.channel.sendFile("https://puu.sh/uNpBW/b360eb05f7.png");
    console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "kappahd)");
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
     }
 if(msg.channel.type === "text")
 {
  if(input.startsWith(prefix + "BAN"))
    {
      if(msg.member.hasPermission("BAN_MEMBERS"))
        {
        var ID = msg.content.slice(7, -1)
          msg.guild.ban(ID)
          msg.channel.sendMessage("**I've Banned:hammer: <@" + ID + "> because **<@" + msg.author.id + ">** want it**")
          console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "ban)");
        }else{
          msg.reply("*You need a role that provide the right to ban People*")
          console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "ban)[no rights] ");
        }
    }

   if(input.startsWith(prefix + "KICK"))
     {
       if(msg.member.hasPermission("KICK_MEMBER"))
         {
         var ID2 = msg.content.slice(8, -1)
            msg.guild.ban(ID2)
            msg.channel.sendMessage("**I've Kicked <@" + ID2 + "> because **<@" + msg.author.id + ">** want it**")
            msg.channel.sendFile("http://cdn2.hubspot.net/hub/98462/file-39842987-jpg/images/to_get_kicked_out,_phrasal_verb_for_english_learners.jpg")
            console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "kick)");
         }else{
            msg.reply("*You need a role that provide the right to kick People*")
            console.log(log + msg.author.username + "/" + msg.author.id + " (" + prefix + "kick)[no rights] ");
         }
     }
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
        console.log(log +msg.author.username + "/" + msg.author.id + " (" + prefix + "urban)" );
      }
    );
    }

}
);

bot.login(Token);
