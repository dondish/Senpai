const rethink  = require('rethinkdb')
const Discord = require('discord.js')
module.exports = async (messageReaction, user) => {
    function handleStarboard(connection, message) {
        rethink.table('StarboardMessages').get(message.guild.id)
        .run(connection, (err, result) => {
            if (err) throw err
            const msgIDs = result.MessageIDs
            msgIDs.push(message.id)
            rethink.table('StarboardMessages')
            .get(message.guild.id)
            .update({"MessageIDs": msgIDs})
            .run(connection, err => {
                if (err) throw err
                rethink.table('guildConfig')
                .get(message.guild.id)
                .run(connection, (err, result) => {
                    if(err) throw err
                    connection.close()
                    if(result.StarboardID !== 'None') {
                    const embed = new Discord.RichEmbed()
                        .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL}`)
                        .addField(`ID:`, `${message.id}`)
                        .addField('Channel', `${message.channel}`)
                        .addField(`Message:`, `${message.content}`)
                        .setTimestamp()
                        .setColor(0x80ff00)
                    message.guild.channels.get(result.StarboardID).send({embed})
                    }
                })
            })
        })
    }
    if(user.bot) return
    if(messageReaction.emoji.name !== "⭐") return
    const message = messageReaction.message
    if(!message.guild) return
    const connection = await rethink.connect()
    connection.use('Discord')
    rethink.table('StarboardMessages').get(message.guild.id)
    .run(connection, (err, result) => {
        if (err) throw err
        if(result === null) {
            rethink.table('StarboardMessages').insert({
                "id": message.guild.id,
                "MessageIDs": []
            })
            .run(connection, err => {
                 if (err) throw err
                 handleStarboard(connection, message)
            })
        } else {
            if (result.MessageIDs.includes(message.id)) return;
            handleStarboard(connection, message)
        }
    })
}
