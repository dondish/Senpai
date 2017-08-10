const rethink = require('rethinkdb');
const config  = require('../../config/config.json')
const async   = require('async')
exports.run = async (client, msg, args) => {

    function purge(messagecount) {
        msg.channel.fetchMessages({'limit': messagecount}).then(messages => {
            msg.channel.bulkDelete(messages)
                .then(() => {
                msg.channel.send("i've deleted " + messages.size + " Messages")
                .then(message => message.delete(10000).catch())
                })
                .catch(() => {
                    msg.channel.send("I may only delete Messages that are not older than 14 Days! thats is a Limit from Discord")
                })
        })
        .catch(console.error);
    }
  if (args.length < 1) return msg.reply('You must add a Number of the amount of to deleting messages behind!');
  if(!msg.deletable) return msg.reply("I have no rights to delete Messages!")
  let messagecount = parseInt(args.join(' '), 10);
  if(isNaN(messagecount)) return msg.reply("This Command only accept numbers!")
  if(messagecount <= 1) return msg.reply("You must purge more than 1 Message!")
  if(messagecount > 100) return msg.reply("You can only delete 100 Messages at the time!")

    const connection = await rethink.connect()
    connection.use('Discord')
    rethink.table('guildConfig')
    .get(msg.guild.id)
    .run(connection, (err, result) => {
        if (err) throw err
        connection.close()
        const ModroleIDs = result.ModerationRolesIDs
        let prefix = result.customPrefix
        if(prefix === "None") prefix = config.prefix
        let haveModerationRole = false
        async.forEach(ModroleIDs, function(ID, callback) {
            if(msg.member.roles.has(ID)) haveModerationRole = true
            callback();
        }, function() {
            if(haveModerationRole === false && msg.guild.owner.id !== msg.author.id) return msg.reply(`You have no role that is registered as an Moderation Role! add/remove these in my configuration with ${prefix}modrole`)
            purge(messagecount)
        })
    })

};

exports.help = {
    'name': 'purge',
    'description': 'delete X amount of messages from the current channel ',
    'usage': 'purge <number>'
}

exports.alias = ["prune", "bulkdelete"]
