const Commands = require('../../structures/new/Command.js')
const info = {
    "name": "volume",
    "description": "shows or change the current volume",
    "aliases": [],
    "examples": ["volume", "volume 0.8", "volume 1.2"]
}

class VolumeCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg, params) {
        const voiceConnection = msg.guild.voiceConnection
        if(voiceConnection === null) return msg.reply(`Im not in a Voice channel on this Server!`)
        const dispatcher = voiceConnection.dispatcher
        if(!dispatcher) return msg.reply(`I don't play music at the moment!`)
        if(!params[0]){
            await msg.channel.send(`the current volume is ${dispatcher.volume}`)
        }else{
            const isLimited = await msg.guild.getConfig(this.client)
            if(isLimited.musicLimited){
                const permissionLevel = await msg.member.getPermissionsLevel(this.client)
                if(permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!")
            }
            const  number = params[0]
            if(isNaN(number)) return msg.channel.send("This command only accept numbers!")
            if(number > 2 || number < 0.1) return msg.channel.send("You can only choose a number between 2 and 0.1 where 2=200% volume and 0.1=10% volume from the current volume!")
            dispatcher.setVolume(number)
            await msg.channel.send(`You set the Volume to ${number}`)
        }
    }
}

module.exports = VolumeCommand
