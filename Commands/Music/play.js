const music     = require('../../Util/music.js')
const config = require('../../config/config.json')
const rethink = require('rethinkdb')
const async = require('async')
exports.run = async (client, msg, args) => {
    if (msg.channel.type !== "text") return msg.channel.send("You can run this command only on a Server!")
    let voiceConnection = msg.guild.voiceConnection
    let Link = args
    if (voiceConnection === null) return msg.reply(`You must let me join a Voice Channel with ${config.prefix}join!`)
    if (!args.join(" ")) return msg.reply('No video specified!');
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
            },async () => {
                if(haveMusicrole === false && msg.guild.owner.id !== msg.author.id) return msg.reply(`You have no role that is registered as an Music Role so you have no permission to do that! add/remove these in my configuration with ${prefix}musicrole`)
                const message = await msg.channel.send('trying to add your Song/Playlist to the queue....')
                music.addtoqueue(Link, msg.member)
                .then(result => {
                if(result.length > 1) {
                    message.edit(`${result[0]} Songs were added, ${result[1]} Songs are to long, ${result[2]} Songs are claimed/taken down`)
                    music.playqueue(msg.guild, msg.channel)
                } else {
                    message.edit(result[0])
                    music.playqueue(msg.guild, msg.channel)
                }
                })
                .catch(err => {
                    message.edit(`Could not add the Song/Playlist with following reason: ${err}`)
                })
            })
        })
}

exports.help = {
    'name': 'play',
    'description': 'play a Song/playlist from youtube or search for it if you not enter a link',
    'usage': 'play [link to a youtube song or playlist/name of a song]'
}

exports.alias = []
