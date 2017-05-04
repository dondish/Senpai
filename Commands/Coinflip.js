const config                                = require('../config/config.js');
exports.run = (client, msg, params) => {
    var input = msg.content.toUpperCase()
    function coinFlip() {
    return Math.round(Math.random())
}
    if (params.length < 1) return msg.reply('You can only use coinflip if you add Head/Number behind it!');
    var inputcoin = input.slice(config.prefix.length + 9);
    if(inputcoin === 'HEAD' || inputcoin === 'NUMBER')
     {
        var convertcoin
        if(inputcoin === 'HEAD')
        {
          convertcoin = 1
        }else{
          convertcoin = 0
        }
        if(coinFlip() === convertcoin)
        {
          msg.channel.send("You won :heart:")
        }else{
          msg.channel.send("You lost Feelsbadman")
        }
     }else{
       msg.reply("You can only choose Head or Number!")
     }
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'Coinflip',
    'description': 'try a Coinflip',
    'usage': 'coinflip [Head/Number]'
}
