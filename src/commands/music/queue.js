const Commands = require('../../structures/new/Command.js')
const info = {
    "name": "queue",
    "description": "shows the music queue of this server",
    "aliases": ["songs", "playlist", "list"],
    "examples": ["queue"]
}

class QueueShow extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    format(seconds) {
        function pad(seconds3){
            return (seconds3 < 10 ? '0' : '') + seconds3;
        }
        let hours = Math.floor(seconds / (60*60));
        let minutes = Math.floor(seconds % (60*60) / 60);
        let seconds2 = Math.floor(seconds % 60);
            return pad(hours) + 'h:' + pad(minutes) + 'm:' + pad(seconds2)+ 's';
    }

    async run(msg) {
        const queue = msg.guild.getQueue()
        if(queue.length < 1) {
            await msg.reply("there are no songs currently in queue!")
        }else{
            //Print the total amount of time in the playlist
            let totalTimeInSec = 0;
            //Get the length of every song in seconds
            const songsLength = queue.map(Song => Number(Song.length_seconds));

            //Add all the lengths into totalTimeInSec
            for (let index = 0; index < songsLength.length; index++) {
                totalTimeInSec += songsLength[index];
            }
            const time = this.format(Math.floor(totalTimeInSec))
            const songs = queue.map(Song => `${Song.title} requested by **${Song.requestedBy.username}**`)
            if(songs.length > 15) {
                let before = songs.length
                songs.length = 15;
                songs[15] = `**and ${before - 15} songs more...**\n`
                songs[16] = `**total length: ${time}**`
                await msg.channel.send(songs.join("\n"))
            } else {
                await msg.channel.send(songs.join("\n"))
                await msg.channel.send(`**total length: ${time}**`)
            }
        }
    }
}

module.exports = QueueShow
