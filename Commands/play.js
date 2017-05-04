const yt                                    = require('ytdl-core');
const fs                                    = require('fs');
const config                                = require('../config/config.js')
exports.run = (client, msg, args) => {
    if (msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    var voiceConnection = msg.guild.voiceConnection
    let queues = {};
    var Video  = msg.content.slice(config.prefix.length + 5)
    function getQueue(guild) {
    if (!queues[guild]) queues[guild] = [];
    return queues[guild];
    }
    const filename = Video.slice(32)
    const queue = getQueue(msg.guild.id);
    function executeQueue(msg, queue) {
        yt.downloadFromInfo(queue[0], {'filter': 'audioonly'})
        .pipe(fs.createWriteStream(`./audio_cache/${filename}.mp3`));
        return;
    }

    if (voiceConnection === null) return msg.reply(`You must let me join a Voice Channel with ${config.prefix}join!`)
    if (!Video) return msg.reply('No video specified!');
            //Get the video information.
        msg.channel.send('Searching...').then(response => {
            //If the suffix doesn't start with 'http', assume it's a search.
            if (!Video.toLowerCase().startsWith('http')) {
                Video = 'gvsearch1:' + Video;
            }
            //Get the video info from youtube-dl.
            yt.getInfo(Video, (err, info) => {
                //Verify the info.
                if (err || info.video_id === undefined) {
                    return response.edit('Invalid video!');
                }
                //Queue the video.
                response.edit('**Queued:** ' + info.title).then(() => {
                    queue.push(info);
                    if (fs.existsSync(`./audio_cache/${filename}.mp3`)) {
                    const dispatcher = voiceConnection.playFile(`./audio_cache/${filename}.mp3`)
                    dispatcher.on('end', () => {
                    msg.channel.send("Playback finished.")
                    })
                    }else{
                        executeQueue(msg, queue)
                    setTimeout(() => {
                    const dispatcher = voiceConnection.playFile(`./audio_cache/${filename}.mp3`)
                    dispatcher.on('end', () => {
                    msg.channel.send("Playback finished.")
                    })
                    }, 5000)
                    }
                })
                .catch(console.log);
            });
        })
        .catch(console.log);



    console.log("[Command]     ", msg.author.username + "/" + msg.author.id, "(" + msg.content + ")")
}

exports.help = {
    'name': 'Play',
    'description': 'play a Song from Youtube',
    'usage': 'play [Link to a Youtube Song]'
}
