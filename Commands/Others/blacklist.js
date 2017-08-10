const Discord = require('discord.js')
const {OwnerID} = require('../../config/config.json')
const rethink = require('rethinkdb')
exports.run = (client, msg, params) => {
    async function addtoDB(user, reason) {
        const connection = await rethink.connect();
        connection.use('Discord')
        rethink.table('Blacklist')
            .get(user.id)
            .run(connection, (err, result) => {
                if (err) throw err
                if(result !== null) return msg.reply('this user is already blacklisted :eyes:')
                rethink.table('Blacklist').insert({
                    'id': user.id,
                    'Reason': reason
                })
                .run(connection, err => {
                    if (err) throw err
                    const embed = new Discord.RichEmbed()
                        .setAuthor(user.username, user.displayAvatarURL)
                        .addField("I blacklisted the user", user.toString())
                        .addField('with the reason', reason)
                        .setColor(0x80ff00)
                        .setTimestamp()
                        .setFooter("Senpai Bot by Yukine");
                    msg.channel.send({embed});
                })
            })
    }
    async function deleteFromDB(user) {
        const connection = await rethink.connect();
        connection.use('Discord')
        rethink.table('Blacklist')
            .get(user.id)
            .run(connection, (err, result) => {
                if (err) throw err
                if(result === null) return msg.reply('this user is not blacklisted at the moment :eyes:')
                rethink.table('Blacklist')
                    .get(user.id)
                    .delete()
                    .run(connection, err => {
                    if (err) throw err
                    const embed = new Discord.RichEmbed()
                        .setAuthor(user.username, user.displayAvatarURL)
                        .addField("I removed this user from my blacklist", user.toString())
                        .setColor(0x80ff00)
                        .setTimestamp()
                        .setFooter("Senpai Bot by Yukine");
                    msg.channel.send({embed});
                })
            })
    }
    let addOrDelete = params[0];
    if(!addOrDelete) return msg.reply('you must choose if you wanna add or delete a user to the blacklist list :eyes:');
    let user = params[1];
    let reason = params.slice(2).join(" ");
    if(msg.author.id !== OwnerID) return msg.channel.send('Only my owner can execute that command');
    if(!user) return msg.channel.send("You must supply an ID/Mention of the user to blacklist :eyes:");
    if(!reason) reason = 'no reason provided';
    const param1 = addOrDelete.toLowerCase()
    if(msg.mentions.users.size === 1)
    {
        user = msg.mentions.users.first()
        if(param1 === "add") {
            addtoDB(user, reason)
        }else if(param1 === 'delete') {
            deleteFromDB(user)
        }else {
            return msg.channel.send("the first parameter must be add or delete")
        }
    }else{
        client.fetchUser(user)
            .then(newUser => {
                if(param1 === "add") {
                    addtoDB(newUser, reason)
                }else if(param1 === 'delete') {
                    deleteFromDB(newUser)
                }else {
                    return msg.channel.send("the first parameter must be add or delete")
                }
            })
            .catch(() => msg.reply('Seems like your ID is not valid :eyes:').then(message => message.delete(5000)))
    }
}

exports.help = {
    'name': 'blacklist',
    'description': 'blacklist someone from using this Bot (Only the owner of this bot can use this command!)',
    'usage': 'blacklist [add/delete] [ID/Mention] [reason]'
}

exports.alias = ["block"]
