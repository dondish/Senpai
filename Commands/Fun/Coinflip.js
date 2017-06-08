const config                                = require('../../config/config.json');
exports.run = (client, msg, params) => {
    let input = msg.content.toUpperCase()
    function coinFlip() {
    return Math.round(Math.random())
}
    if (params.length < 1) return msg.reply('You can only use coinflip if you add Head/Number behind it!');
    let inputcoin = input.slice(config.prefix.length + 9);
    if(inputcoin === 'HEAD' || inputcoin === 'NUMBER')
     {
        let convertcoin
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
}

exports.help = {
    'name': 'coinflip',
    'description': 'try a coinflip',
    'usage': 'coinflip [Head/Number]'
}

exports.alias = []
