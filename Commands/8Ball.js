exports.run = (client, msg, params) => {
    if (params.length < 1) return msg.reply('8ball is for questions so please add a question behind.');
    var ouput  = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
    var input   = msg.content.slice(7)
    msg.reply("You ask me `" + input + "` and my answer is: **" + ouput[Math.floor(Math.random()*ouput.length)] + "**")
}

exports.help = {
    'name': '8Ball',
    'description': 'Answers a Question',
    'usage': '8ball [Question]'
}
