const Commands = require('../../structures/new/Command.js')
const {RichEmbed} = require('discord.js')
const info = {
    "name": "leaderboard",
    "description": "shows the top 10 user with the most money on this server",
    "aliases": ["baltop"],
    "examples": ["leaderboard"]
}

class LeaderboardCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg) {
        try{
            const leaderboard = await msg.guild.getLeaderboard(this.client)
            let currency = this.client.guilds.get("199857240037916672").emojis.get("322135966322262056")
            await msg.guild.fetchMembers();
            const mapped = [];
            console.log(leaderboard)
            for(let player of leaderboard) {
                try {
                const thisPlayer = msg.guild.members.get(player.userID)
                mapped.push(`${thisPlayer.user.tag} ${player.cash + player.bank}${currency}`)
                } catch (error) {
                   //nothing kek
                }
            }
            if(mapped.length > 10) mapped.length = 10
            const embed = new RichEmbed()
            .setTitle(`Leaderboard for ${msg.guild.name}`)
            let index = 1;
            for(let user of mapped) {
                embed.addField(`Rank #${index}`, user)
                index++
            }
            await msg.channel.send({embed})
        }catch(error){
            await msg.channel.send(`Errored with following Error: ${error.message}`)
        }
    }
}

module.exports = LeaderboardCommand
