const music = require('../../Util/music.js')
const config = require('../../config/config.json')
const rethink = require('rethinkdb')
const async = require('async')
exports.run = async (client, msg, args) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
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
                if(args.length > 1) return msg.reply("You must add the number of the Song which you wanna remove!")
                let number = parseInt(args[0], 10)
                if (number === 1) return msg.reply(`You try to delete the current playing song from the queue use ${config.prefix}skip instead`)
                if (isNaN(number)) return msg.reply("I only accpet the queue number in this command")
                music.deletesong(msg, number)            
            })
        })
}

exports.help = {
    'name': 'removesong',
    'description': 'delete 1 song from the queue',
    'usage': 'removesong <queue number>'
}

exports.alias = ["deletesong"]
