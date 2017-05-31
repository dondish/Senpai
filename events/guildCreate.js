const snekfetch = require('snekfetch')
const config    = require('../config/config.js')
module.exports = guild => {
    snekfetch.post(`https://discordbots.org/api/bots/${guild.client.user.id}/stats`)
        .set('Authorization', config.discordOrgToken)
        .send({"server_count": guild.client.guilds.size})
        .then(console.log('Updated dbots.org status.'))
    console.log(`Senpai left the Guild ${guild.name} size is now ${guild.client.size}`)
}
