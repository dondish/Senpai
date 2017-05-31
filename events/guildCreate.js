const snekfetch = require('snekfetch')
module.exports = guild => {
    snekfetch.post(`https://discordbots.org/api/bots/${guild.client.user.id}/stats`)
        .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE4NDYzMjIyNzg5NDY1NzAyNSIsImlhdCI6MTQ5NjI1NzQ0MH0.LBsfcm-rczR-rC8LT-2Jiq7yMZMWP9z39eDANFnZWd8')
        .send({"server_count": guild.client.guilds.size})
        .then(console.log('Updated dbots.org status.'))
    console.log(`Senpai left the Guild ${guild.name} size is now ${guild.client.size}`)
}
