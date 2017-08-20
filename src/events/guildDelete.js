const Events = require('../structures/new/Event.js')
const snekfetch = require('snekfetch')
const chalk = require('chalk')

class LeaveEvent extends Events {
    constructor(client) {
        super(client)
        this.name = 'guildDelete'
    }

    async run(guild) {
        const size = await guild.client.shard.fetchClientValues('guilds.size')
        const guildsizes = size.reduce((prev, val) => prev + val, 0)
        await snekfetch.post(`https://discordbots.org/api/bots/${guild.client.user.id}/stats`)
            .set('Authorization', this.client.config.discordOrgToken)
            .send({"server_count": guildsizes})
        console.log(chalk.bgCyan(`${guild.client.user.username} leaved the Guild ${guild.name} size is now ${guildsizes}`))
    }
}

module.exports = LeaveEvent
