const music = require('../../Util/music.js')
const config = require('../../config/config.json')
const rethink = require('rethinkdb')
const async = require('async')
exports.run = async (client, msg, args) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    let number = Number(args[0])
    if(args[0] === undefined) {
    music.showVolume(msg)
    } else {
    const connection = await rethink.connect();
    connection.use('Discord')
    rethink.table('guildConfig')
        .get(msg.guild.id)
        .run(connection, (err, result) => {
            if (err) throw err
            const MusicRolesIDs = result.MusicRolesIDs
            let haveMusicrole = false
            let prefix = result.customPrefix
            if(prefix === "None") prefix = config.prefix
            async.forEach(MusicRolesIDs, (ID, callback) => {
            if(msg.member.roles.has(ID)) haveMusicrole = true;
            callback();
            }, () => {
                connection.close()
                if(haveMusicrole === false && msg.guild.owner.id !== msg.author.id) return msg.reply(`You have no role that is registered as an Music Role so you have no permission to do that! add/remove these in my configuration with ${prefix}musicrole`)
                    if (isNaN(number)) return msg.channel.send("This command only accept numbers!")
                    if(number > 2 || number < 0.1) return msg.channel.send("You can only choose a number between 2 and 0.1 where 2=200% volume and 0.1=10% volume from the current volume!")
                    music.changeVolume(msg, number)
            })
        })
    }
}

exports.help = {
    'name': 'volume',
    'description': 'show/change the volume on the current playing song from the bot',
    'usage': 'volume or volume [number between 0.1 and 1]'
}

exports.alias = []
