const Commands = require('../../structures/new/Command.js')
const info = {
    "name": "play",
    "description": "adds a Song/playlis from youtube to the queue and start the queue",
    "aliases": ["add"],
    "examples": ["play owl city fireflies", "play https://www.youtube.com/watch?v=psuRGfAaju4", "play Adele Hello"]
}

class PlayCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg, params, prefix) {
        const voiceConnection = msg.guild.voiceConnection
        const guildConfig = await msg.guild.getConfig(this.client)
        let channel = guildConfig.musicID
        if(channel === "None") channel = undefined
        const musicChannel = channel || msg.channel
        if (voiceConnection === null) return msg.reply(`You must let me join a Voice Channel with ${prefix}join!`)
        const message = await msg.channel.send('trying to add your Song/Playlist to the queue....')
        let link = params[0]
        if(link.startsWith('http')) {
            if(link.includes("watch") || link.includes("youtu.be")) {
                try{
                    const result = await this.client.music.handleSong(link, true, msg.guild.getQueue(), msg.author)
                    message.edit(result)
                }catch(error){
                    message.edit(`Could not add the Song/Playlist because this reason ${error.message}`)
                }
            }else if(link.includes("playlist")){
                try{
                    const result = await this.client.music.handlePlaylist(link, msg.guild.getQueue(), msg.author)
                    message.edit(result)
                }catch(error){
                    message.edit(`Could not add the Song/Playlist because this reason ${error.message}`)
                }
            }else{
                message.edit("Could not add the Song/Playlist because this link is not from Youtube!")
            }
            }else{
                try{
                    const searchTerm = params.join(" ")
                    const result = await this.client.music.handleSong(searchTerm, false, msg.guild.getQueue(), msg.author)
                    message.edit(result)
                }catch(error){
                    message.edit(`Could not add the Song/Playlist because this reason ${error.message}`)
                }
            }
            this.client.music.playqueue(musicChannel)
    }
}

module.exports = PlayCommand
