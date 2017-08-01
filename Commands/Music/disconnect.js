const music = require('../../Util/music.js')
const config = require('../../config/config.json')
const rethink = require('rethinkdb')
const async = require('async')
exports.run = async (client, msg) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    const voiceConnection = msg.guild.voiceConnection
    if (voiceConnection === null) return msg.reply("im not in a Voice Channel!")
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
                music.disconnect(msg)
                msg.channel.send("Bye Bye :wave:")
            })
        })
}

exports.help = {
    'name': 'disconnect',
    'description': 'leave a voice channel',
    'usage': 'leave'
}

exports.alias = ["leave"]
