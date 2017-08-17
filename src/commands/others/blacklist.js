const Commands = require('../../structures/new/Command.js')
const {RichEmbed} = require('discord.js')
const info = {
    "name": "blacklist",
    "description": "blacklist a user from using me",
    "aliases": ["block"],
    "examples": ["blacklist add @User [reason]", "blacklist delete @User", "blacklist show @User"]
}

class BlacklistCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg, params) {
        const client = this.client
        const permissionLevel = await msg.member.getPermissionsLevel(client)
        if(permissionLevel !== 0) return msg.channel.send("Because of security measures, only the Bot Owner can execute this command")
        let parameter1 = params[0]
        if(!parameter1){
            return msg.reply('you must choose if you wanna add or delete a user to the blacklist list :eyes:');
        }else{
            parameter1 = parameter1.toLowerCase()
            let reason = params.slice(2).join(" ");
            if(!reason) reason = 'no reason provided';
            let user;
            if(msg.mentions.users.size === 0){
                try{
                    user = await client.fetchUser(user)
                }catch(error){
                    return msg.reply("the provided UserID is not valid :eyes:")
                }
            }else{
                user = msg.mentions.users.first()
            }
            if(parameter1 === "add"){
                const result = await client.db.blacklist.getByID(user.id)
                if(result) return msg.reply("this user is already blacklisted")
                await client.db.blacklist.insertDate({
                        'id': user.id,
                        reason
                })
                const embed = new RichEmbed()
                    .setAuthor(user.username, user.displayAvatarURL)
                    .addField("I blacklisted the user", user.toString())
                    .addField('with the reason', reason)
                    .setColor(0x80ff00)
                    .setTimestamp()
                    .setFooter("Senpai Bot by Yukine");
                await msg.channel.send({embed});
            }else if(parameter1 === "delete"){
                const result = await client.db.blacklist.getByID(user.id)
                if(!result) return msg.reply("this user is not blacklisted!")
                await client.db.blacklist.getAndDelete(user.id)
                const embed = new RichEmbed()
                    .setAuthor(user.username, user.displayAvatarURL)
                    .addField("I removed this user from my blacklist", user.toString())
                    .setColor(0x80ff00)
                    .setTimestamp()
                    .setFooter("Senpai Bot by Yukine");
                await msg.channel.send({embed});
            }else if(parameter1 === "show"){
                const result = await client.db.blacklist.getByID(user.id)
                if(!result) return msg.reply("this user is not blacklisted!")
                const embed = new RichEmbed()
                    .setAuthor(user.username, user.displayAvatarURL)
                    .addField("Reason:", result.reason)
                    .setColor(0x80ff00)
                    .setTimestamp()
                    .setFooter("Senpai Bot by Yukine");
                await msg.channel.send({embed});
            }else{
                return msg.reply("You provied a wrong first parameter")
            }
        }
    }
}

module.exports = BlacklistCommand
