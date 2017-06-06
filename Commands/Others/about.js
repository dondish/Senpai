const Discord = require('discord.js');
const Package = require('../../package.json')
exports.run = (client, msg) => {
const dateformatted = new Date().toISOString()

    const embed = new Discord.RichEmbed()
        .setTitle("About Senpai version: " + Package.version)
        .setAuthor("Yukine", "https://images-ext-2.discordapp.net/.eJwFwVEOwiAMANC7cAA6KiuwxHiWUjqdUUcA_dDs7r73M-_2MIu5jVH7AiDlZcvWZW-Fa7WyP4E_PLh1cNHTCRFDTJ7mMOEMXLKQUEZN5B0FVZdJV1JGDaske6_XS9--enYYzfEHhdAiAA.COLvqNfJ1q2tD1aEnwOV-DNW7xQ?width=80&height=80")
        .addField('Creator/Dev', 'Yukine', true)
        .addField('RAM usage:', `${Math.round(process.memoryUsage().heapTotal/1000000)}MB`, true)
        .setColor("DARK_GREEN")
        .addField('Libary', `Discord.js ${Discord.version}`)
        .addField('Total Servers:', client.guilds.size, true)
        .addField('Total Users:', client.users.size, true)
        .addField('Total Shards:', `${client.shard.count}`, true)
        .addField('GitHub', "https://github.com/Dev-Yukine/Senpai-Bot-Discord")
        .setTimestamp(dateformatted)
    msg.channel.send({embed})
}

exports.help = {
    'name': 'About',
    'description': 'shows information about me and my creator',
    'usage': 'about'
}

exports.alias = ["info"]
