const Discord = require('discord.js');
const Package = require('../package.json')
exports.run = (client, msg) => {
    var dateformatted =new Date().toISOString()

    const embed = new Discord.RichEmbed()
        .setTitle("About Senpai version: " + Package.version)
        .setAuthor("Yukine", "https://images-ext-2.discordapp.net/.eJwFwVEOwiAMANC7cAA6KiuwxHiWUjqdUUcA_dDs7r73M-_2MIu5jVH7AiDlZcvWZW-Fa7WyP4E_PLh1cNHTCRFDTJ7mMOEMXLKQUEZN5B0FVZdJV1JGDaske6_XS9--enYYzfEHhdAiAA.COLvqNfJ1q2tD1aEnwOV-DNW7xQ?width=80&height=80")
        .addField('Creator/Dev', 'Yukine')
        .setColor("DARK_GREEN")
        .addField('Total Servers', client.guilds.size)
        .addField('Libary', `Discord.js ${Package.devDependencies.discordjs}`)
        .addField('GitHub', "https://github.com/Fr3akGam3r/Senpai-Bot-Discord")
        .setTimestamp(dateformatted)
    msg.channel.send({embed})
    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'About',
    'description': 'shows information about me and my creator',
    'usage': 'about'
}
