const Commands = require('../../structures/new/Command.js')
const {RichEmbed} = require('discord.js')
const info = {
    "name": "history",
    "description": "shows the moderation history of the mentioned user",
    "aliases": [],
    "examples": ["history @User"]
}

class HistoryCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg) {
        let member = msg.mentions.members.first()
        if(!member) member = msg.member
        const history = await member.getHistory(this.client)
        let warning;
        let kicks;
        let bans;
        if(history.warnings.length > 0){
            warning = history.warnings[history.warnings.length - 1]
        }
        if(history.kicks.length > 0) {
            kicks = history.kicks[history.kicks.length - 1]
        }
        if(history.bans.length > 0)  {
            bans = history.bans[history.bans.length - 1]
        }
        const embed = new RichEmbed()
            .setAuthor(member.user.username, member.user.displayAvatarURL)
            .addField(`Warnings: ${history.warnings.length}`, `last Warning reason: ${warning || "no warnings so far"}`)
            .addField(`Kicks: ${history.kicks.length}`, `last Kick reason: ${kicks || "no kicks so far"}`)
            .addField(`Bans: ${history.bans.length}`, `last ban reason: ${bans || "no bans so far"}`)
        msg.channel.send({embed})
    }
}

module.exports = HistoryCommand
