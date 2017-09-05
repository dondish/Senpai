const Commands = require('../../structures/new/Command.js')
const info = {
    "name": "loop",
    "description": "loops or remove the loop from your current queue!",
    "aliases": ["repeat"],
    "examples": ["loop"]
}

class LoopCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg) {
        if(msg.guild.getQueue().size === 0) return msg.reply("You can`t loop an empty queue :eyes:")
        const boolean = msg.guild.getLoop()
        if(boolean === true){
            msg.guild.setLoop(false)
            await msg.channel.send("stopping the loop!")
        } else if(boolean === false) {
            msg.guild.setLoop(true)
            await msg.channel.send("looping the current queue!")
        }
    }
}

module.exports = LoopCommand
