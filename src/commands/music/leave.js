const Commands = require('../../structures/new/Command.js')
const info = {
    "name": "leave",
    "description": "disconnect from voiceChannel im currently in!",
    "aliases": [],
    "examples": ["disconnect"]
}

class LeaveCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg) {
        const voiceConnection = msg.guild.voiceConnection
        if (voiceConnection === null) return msg.reply(`Im not in a Voice channel on this Server!`)
        try{
            let queue = msg.guild.getQueue();
            let voiceConnection = msg.guild.voiceConnection
            let dispatcher   = voiceConnection.dispatcher;
            if (queue.length > 0) queue.length = 0
            if (dispatcher) dispatcher.end()
            await voiceConnection.disconnect()
            await msg.channel.send("bye bye :wave:")
        }catch(error){
            msg.channel.send('ooops! something went wrong while trying to leave to your Voicechannel please try to let me leave again!')
        }
    }
}

module.exports = LeaveCommand
