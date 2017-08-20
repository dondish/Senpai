const Commands = require('../../structures/new/Command.js')
const info = {
    "name": "skip",
    "description": "skip the current playing song",
    "aliases": [],
    "examples": ["skip"]
}

class SkipCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg) {
        const voiceConnection = msg.guild.voiceConnection
        if(voiceConnection === null) return msg.reply(`Im not in a Voice channel on this Server!`)
        const dispatcher = voiceConnection.dispatcher
        if(!dispatcher) return msg.reply(`I don't play music at the moment!`)
        const isLimited = await msg.guild.getConfig(this.client)
        if(isLimited.musicLimited){
            const permissionLevel = await msg.member.getPermissionsLevel(this.client)
            if(permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!")
        }
        dispatcher.end()
        await msg.channel.send("Skipped the played Song!")
    }
}

module.exports = SkipCommand
