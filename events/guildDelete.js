const snekfetch = require('snekfetch')
const config    = require('../config/config.json')
module.exports = async guild => {
    const size = await guild.client.shard.fetchClientValues('guilds.size')
    const guildsizes = size.reduce((prev, val) => prev + val, 0)
    snekfetch.post(`https://discordbots.org/api/bots/${guild.client.user.id}/stats`)
        .set('Authorization', config.discordOrgToken)
        .send({"server_count": guildsizes})
        .then(() => console.log(`${guild.client.user.username} left the Guild ${guild.name} size is now ${guildsizes}`))
        .catch(() => console.log("dbots website down"))
}
