const Discord = require('discord.js');
const Package = require('../../package.json')
const config  = require('../../config/config.json')
exports.run = (client, msg) => {
const dateformatted = new Date().toISOString()

                function format(seconds){
                    function pad(seconds3){
                        return (seconds3 < 10 ? '0' : '') + seconds3;
                    }
                let hours = Math.floor(seconds / (60*60));
                let minutes = Math.floor(seconds % (60*60) / 60);
                let seconds2 = Math.floor(seconds % 60);

                return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds2);
        }
    const owner = client.users.get(config.OwnerID)
    const embed = new Discord.RichEmbed()
        .setTitle("About Senpai version: " + Package.version)
        .setAuthor(owner.username, owner.displayAvatarURL)
        .addField('Creator/Dev', 'Yukine', true)
        .addField('RAM usage:', `${Math.round(process.memoryUsage().heapTotal/1000000)}MB`, true)
        .setColor("DARK_GREEN")
        .addField('Libary', `Discord.js ${Discord.version}`)
        .addField('Total Servers:', client.guilds.size, true)
        .addField('Total Users:', client.users.size, true)
        .addField('Total Shards:', `${client.shard.count}`, true)
        .addField('Uptime', `${format(process.uptime())}`)
        .addField("Bot Invite Link", `[Link](${config.InviteLink})`,true )
        .addField('GitHub', "[Senpai-Bot Github Repo](https://github.com/Dev-Yukine/Senpai-Bot-Discord)", true)
        .addField('Support Server', `[Server](${config.SupportServerLink})`, true)
        .setTimestamp(dateformatted)
    msg.channel.send({embed})
}

exports.help = {
    'name': 'about',
    'description': 'shows information about me and my creator',
    'usage': 'about'
}

exports.alias = ["info"]
