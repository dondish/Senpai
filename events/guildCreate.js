const snekfetch = require('snekfetch')
const config    = require('../config/config.json')
const rethink   = require('rethinkdb')
const moment    = require('moment')
module.exports = async guild => {
    snekfetch.post(`https://discordbots.org/api/bots/${guild.client.user.id}/stats`)
        .set('Authorization', config.discordOrgToken)
        .send({"server_count": guild.client.guilds.size})
    console.log(`Senpai Joined the Guild ${guild.name} size is now ${guild.client.guilds.size}`)
    const members = guild.members
    const connection = await rethink.connect()
    members.forEach(function(member) {
    if(member.presence.status === 'offline') return
    rethink.db('Discord').table('OnlineTime')
    .get(`${member.id}`)
    .run(connection, (err, result) => {
        if (err) throw err
        if (result === null) {
            rethink.db('Discord').table('OnlineTime')
            .insert(
            {
            "id": `${member.id}`,
            "time": `${moment().unix()}`
            }
            )
            .run(connection, err => {
            if (err) throw err
            connection.close();
            })
        }else{
            connection.close();
            return
        }
    })
    });
}
