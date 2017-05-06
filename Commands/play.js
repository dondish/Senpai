const yt                                    = require('ytdl-core');
const fs                                    = require('fs');
const config                                = require('../config/config.js')
const search                                = require('youtube-search');
const searchopts                            = {
      "maxResults": 10,
      "key": config.GoogleApiKey
};
exports.run = (client, msg, args) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    var voiceConnection = msg.guild.voiceConnection
    let queues = {};
    var Video  = msg.content.slice(config.prefix.length + 5)
    if (voiceConnection === null) return msg.reply(`You must let me join a Voice Channel with ${config.prefix}join!`)
    if (!Video) return msg.reply('No video specified!');
    function getQueue(guild) {
    if (!queues[guild]) queues[guild] = [];
    return queues[guild];
    }
    const queue = getQueue(msg.guild.id);
    function playqueue(msg, queue) {
            if(voiceConnection.speaking === true) return;
            if(queue.length < 1) return;
            const queuedvideo = queue[0]
            const id          = queuedvideo.video_id
            const title       = queuedvideo.title
            const dispatcher = voiceConnection.playFile(`./audio_cache/${id}.mp3`)
            dispatcher.on('end', () => {
                msg.channel.send(`Finished playing ${title}`)
                queue.shift()
                }
            )

    }
    function addtoqueue(msg, queue) {
        if (!Video.toLowerCase().startsWith('http')) {
            search(Video, searchopts, function(err, results) {
                if (err) return msg.reply("I had an error while try to search for your song!")
                var firstV = results[0]
                if (firstV.kind != "youtube#video") {
                    firstV = results[1]
                }
                yt.getInfo(firstV.link, (err, info) => {
                    if (err || info.video_id === undefined) {
                        return msg.reply('error while try to get Information about the song');
                        }
                    queue.push(info);
                    msg.channel.send(`**Queued:** ${info.title}`)
                            if(!fs.exists(`./audio_cache/${info.video_id}.mp3`)) {
                                yt.downloadFromInfo(info, {'filter': 'audioonly'})
                                .pipe(fs.createWriteStream(`./audio_cache/${info.video_id}.mp3`));
                            }
                        }
                    )
                }
            )
        }else{
            yt.getInfo(Video, (err, info) => {
                if (err || info.video_id === undefined) {
                    return msg.reply('error while try to get Information about the song');
                    }
                queue.push(info);
                msg.channel.send(`**Queued:** ${info.title}`)
                    if(!fs.exists(`./audio_cache/${info.video_id}.mp3`)) {
                        yt.downloadFromInfo(info, {'filter': 'audioonly'})
                        .pipe(fs.createWriteStream(`./audio_cache/${info.video_id}.mp3`));
                    }
                }
            )
        }
    }
        msg.channel.send('Searching...')
        addtoqueue(msg, queue)
        setTimeout(function() {
            setInterval(function() {
                playqueue(msg, queue)
            }, 5000) }
        , 2000)



    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'Play',
    'description': 'play a Song from Youtube or search for it if you not enter a link',
    'usage': 'play [Link to a Youtube Song/Name of a song]'
}
