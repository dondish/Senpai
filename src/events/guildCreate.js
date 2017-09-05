const Events = require('../structures/new/Event.js')
const snekfetch = require('snekfetch')
const chalk = require('chalk')

class JoinEvent extends Events {
    constructor(client) {
        super(client)
        this.name = 'guildCreate'
    }

    async run(guild) {
        try{
            const size = await guild.client.shard.fetchClientValues('guilds.size')
            const guildsizes = size.reduce((prev, val) => prev + val, 0)
            await snekfetch.post(`https://discordbots.org/api/bots/${guild.client.user.id}/stats`)
                .set('Authorization', this.client.config.dBotsToken)
                .send({"server_count": guildsizes})
            await snekfetch.post(`https://bots.discord.pw/api/bots/${guild.client.user.id}/stats`)
                .set('Authorization', this.client.config.discordBotsToken)
                .send({"server_count": guildsizes})
            console.log(chalk.bgCyan(`${guild.client.user.username} Joined the Guild ${guild.name} size is now ${guildsizes}`))
        }catch(error){
            console.error(chalk.red(`tried to update stats due guildCreate but errored with following Error`, error.message))
        }
    }
}

module.exports = JoinEvent
