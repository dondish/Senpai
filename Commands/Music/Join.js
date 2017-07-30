const config = require('../../config/config.json')
const rethink = require('rethinkdb')
const async = require('async')
exports.run = async (client, msg) => {
    const voiceChannel = msg.member.voiceChannel;
    let voiceConnection = msg.guild.voiceConnection
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    if (!voiceChannel) return msg.reply("You must be in a Voice channel to use this Command!")
    if (!voiceChannel.joinable) return msg.reply("I have no rights to join your Voice channel!")
    if (!voiceChannel.speakable) return msg.reply("I have no rights to speak in your Voice channel!")
    if (voiceConnection !== null) return msg.reply(`Im already in a Voice channel on this Server!`)
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
                if(haveMusicrole === false && msg.guild.owner.id !== msg.author.id) return msg.reply(`You have no role that is registered as an Music Role so you have no permission to do that! add/remove these in my configuration with ${prefix}musicrole`)
                voiceChannel.join()
                    .then(() => {
                        msg.channel.send("successfull joined your Voice Channel")
                    })
                    .catch(err => {
                        msg.channel.send('ooops! something went wrong while trying to connect to your Voicechannel please try to let me join again')
                        console.error(err.message)
                    })
            })
        })
}

exports.help = {
    'name': 'join',
    'description': 'joins a voice channel to play music',
    'usage': 'join'
}

exports.alias = ["summon"]
