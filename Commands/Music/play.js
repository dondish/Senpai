const yt                                    = require('ytdl-core');
const fs                                    = require('fs');
const config                                = require('../../config/config.json')
let   ypi                                   = require('youtube-playlist-info');
const search                                = require('youtube-search');
const searchopts                            = {
      "maxResults": 10,
      "key": config.GoogleApiKey
};
let queues = {};
let dispatchers = {};
function getDispatcher(guild) {
    if (!dispatchers[guild]) dispatchers[guild] = []
    return dispatchers[guild]
}
function getQueue(guild) {
    if (!queues[guild]) queues[guild] = [];
    return queues[guild];
}
exports.queue = msg => {
    let queue = getQueue(msg.guild.id);
    if(queue.length < 1) {
        msg.reply("there are no songs currently in queue!")
    }else{
        queue.forEach(function(element) {
            msg.channel.send(element.title)
            }
        );
    }
}
exports.showVolume = msg => {
    let getdispatcher = getDispatcher(msg.guild.id)
    let dispatcher       = getdispatcher[0]
    if(dispatcher === undefined) return msg.channel.send("i dont play music at the moment!")
    msg.channel.send(`the current volume is ${dispatcher.volume}`)
}
exports.changeVolume = (msg, number) => {
    let dispatchertochange = getDispatcher(msg.guild.id)
    let dispatcher       = dispatchertochange[0]
    if(dispatcher === undefined) return msg.channel.send("i dont play music at the moment!")
    dispatcher.setVolumeLogarithmic(number)
    msg.channel.send(`You set the Volume to ${number}`)
}
exports.disconnect = msg => {
    let queue = getQueue(msg.guild.id);
    if (queue.length > 0) {
        queue.length = 0
    }
    if (msg.guild.voiceConnection.speaking === true) {
            let dispatchertoskip = getDispatcher(msg.guild.id)
            let dispatcher       = dispatchertoskip[0]
            dispatcher.end()
    }
}
exports.clearqueue = msg => {
    let queue = getQueue(msg.guild.id);
    if (queue.length > 0) {
        queue.length = 0
    }
}
exports.deletesong = (msg, number) => {
    let queue = getQueue(msg.guild.id);
    if (number <= 0) return msg.channel.send("There is no Song which is in queue place 0 or less :thinking:")
    if (number > queue.length) return msg.channel.send("You can't try to delete a song that is not there!")
    const indexnumber = number - 1
    msg.channel.send(`I've deleted the Song ${queue[indexnumber].title} from the queue`)
    queue.splice(indexnumber, 1)
}
exports.skip = msg => {
    let dispatchertoskip = getDispatcher(msg.guild.id)
    let dispatcher       = dispatchertoskip[0]
    if(dispatcher === undefined) return msg.channel.send("i dont play music at the moment!")
    dispatcher.end()
    msg.channel.send("Skipped the played Song!")

}
exports.run = (client, msg, args) => {
    if (msg.channel.type !== "text") return msg.channel.send("You can run this command only on a Server!")
    let voiceConnection = msg.guild.voiceConnection
    let Video  = msg.content.slice(config.prefix.length + 5)
    if (voiceConnection === null) return msg.reply(`You must let me join a Voice Channel with ${config.prefix}join!`)
    if (!Video) return msg.reply('No video specified!');
    const queue = getQueue(msg.guild.id);
    const dispatcherStorage = getDispatcher(msg.guild.id, msg)
    function playqueue(msg, queue) {
            if(voiceConnection.speaking === true) return;
            if(queue.length === 0) return;
            if(!voiceConnection) return;
            const queuedvideo = queue[0]
            const id          = queuedvideo.video_id
            const title       = queuedvideo.title
            const author      = queuedvideo.requestedBy
            const dispatcher  = voiceConnection.playFile(`./audio_cache/${id}.mp3`, {"volume": 0.2})
            dispatcherStorage.push(dispatcher)
            dispatcher.on('start', () => {
                    msg.channel.send(`**Start playing: ${title} Requested by** ${author}`)
                }
            )
            dispatcher.on('error', error => {
                console.log(error)
                }
            )
            dispatcher.on('end', () => {
                msg.channel.send(`**Finished playing:** ${title}`)
                queue.shift()
                dispatcherStorage.shift()
                loop(msg, queue)
                }
            )

    }
    function loop(msg, queue) {
        playqueue(msg, queue)
    }
    function addtoqueue(msg, queue) {
        if (!Video.toLowerCase().startsWith('http')) {
            search(Video, searchopts, function(err, results) {
                if (err) return msg.reply("I had an error while try to search for your song!")
                let firstV = results[0]
                if (firstV.kind != "youtube#video") {
                    firstV = results[1]
                }
                yt.getInfo(firstV.link, (err, info) => {
                    if (err || info.video_id === undefined) {
                        return msg.reply('error while try to get Information about the song!');
                    }
                    const length = Number(info.length_seconds)
                    if(length > 1800) return msg.channel.send("The Video can't be longer than 30 minutes!")
                    info.requestedBy = msg.author
                    queue.push(info);
                    msg.channel.send(`**Queued:** ${info.title}`)
                            if(!fs.exists(`./audio_cache/${info.video_id}.mp3`)) {
                                yt.downloadFromInfo(info, {'filter': 'audioonly'})
                                .pipe(fs.createWriteStream(`./audio_cache/${info.video_id}.mp3`).on('finish', function() { playqueue(msg, queue) }));
                                } else {
                                    playqueue(msg, queue);
                                }
                        }
                    )
                }
            )
        }else{
            if(Video.startsWith("watch", 24)) {
            yt.getInfo(Video, (err, info) => {
                if (err || info.video_id === undefined) {
                    return msg.reply('error while try to get Information about the song only Youtube songs are currently playable');
                }
                const length = Number(info.length_seconds)
                if(length > 1800) return msg.channel.send("The Video can't be longer than 30 minutes!")
                info.requestedBy = msg.author
                queue.push(info);
                msg.channel.send(`**Queued:** ${info.title}`)
                    if(!fs.exists(`./audio_cache/${info.video_id}.mp3`)) {
                        yt.downloadFromInfo(info, {'filter': 'audioonly'})
                        .pipe(fs.createWriteStream(`./audio_cache/${info.video_id}.mp3`).on('finish', function() { playqueue(msg, queue) }));
                        } else {
                            playqueue(msg, queue);
                        }
                }
            )
            }else if(Video.startsWith("playlist", 24)) {
                let playlistid = Video.slice(38)
                ypi.playlistInfo(config.GoogleApiKey, playlistid, function(playlistItems) {
                        for(let i = 0; i < playlistItems.length; i++) {
                                    let VideoObj = playlistItems[i]
                                    let VideoUrl = "https://www.youtube.com/watch?v=" + VideoObj.resourceId.videoId
                                     yt.getInfo(VideoUrl, (err, info) => {
                                        if (err || info.video_id === undefined) {
                                            return msg.reply('error while try to get Information about the song only Youtube songs are currently playable');
                                        }
                                        const length = Number(info.length_seconds)
                                        if(length > 1800) return msg.channel.send("One Video can't be played because its longer than 30 minutes!")
                                        info.requestedBy = msg.author
                                        queue.push(info);
                                        msg.channel.send(`**Queued:** ${info.title}`)
                                            if(!fs.exists(`./audio_cache/${info.video_id}.mp3`)) {
                                            yt.downloadFromInfo(info, {'filter': 'audioonly'})
                                            .pipe(fs.createWriteStream(`./audio_cache/${info.video_id}.mp3`).on('finish', function() { playqueue(msg, queue) }));
                                            } else {
                                            playqueue(msg, queue);
                                            }
                                        }
                                    )
                                }
                            }
                        )
            }else{
                msg.channel.send("I dont think your link is valid :thinking: search for an valid Link!")
            }
        }
    }
        msg.channel.send('Searching...')
        addtoqueue(msg, queue)



}

exports.help = {
    'name': 'Play',
    'description': 'play a Song/playlist from Youtube or search for it if you not enter a link',
    'usage': 'play [Link to a Youtube Song or playlist/Name of a song]'
}

exports.alias = []
