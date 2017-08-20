const Commands = require('../../structures/new/Command.js')
const info = {
    "name": "removesong",
    "description": "removes a certian song from the queue",
    "aliases": ["deletesong"],
    "examples": ["removesong 5", "removesong 3", "removesong 8"]
}

class RemoveSongCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg, params, prefix) {
        const number = params[0]
        const queue = msg.guild.getQueue()
        const voiceConnection = msg.guild.voiceConnection
        const isLimited = await msg.guild.getConfig(this.client)
        if(isLimited.musicLimited){
            const permissionLevel = await msg.member.getPermissionsLevel(this.client)
            if(permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!")
        }
        if(voiceConnection === null) return msg.reply(`Im not in a Voice channel on this Server!`)
        const dispatcher = voiceConnection.dispatcher
        if(!dispatcher) return msg.reply(`I don't play music at the moment!`)
        if (number === 1) return msg.reply(`You try to delete the current playing song from the queue use ${prefix}skip instead`)
        if (isNaN(number)) return msg.reply("I only accpet the queue number in this command")
        if (number <= 0) return msg.channel.send("There is no Song which is in queue place 0 or less :thinking:")
        if (number > queue.length) return msg.channel.send("You can't try to delete a song that is not there!")
        const indexnumber = number - 1
        queue.splice(indexnumber, 1)
        await msg.channel.send(`I've deleted the Song ${queue[indexnumber].title} from the queue`)
    }    
}

module.exports = RemoveSongCommand
