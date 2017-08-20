const fs = require('fs');
const yt = require('ytdl-core');
const ypi = require('youtube-playlist-info');
const {googleAPIKey} = require('../../config/config.json')
const search = require('youtube-search');
const searchopts = {
    "maxResults": 10,
    "key": googleAPIKey
};


class Music {

    static async playqueue(channel) {
        //define voiceConnection
        const voiceConnection = channel.guild.voiceConnection;
        //get current queue
        let queue = channel.guild.getQueue();
        //define current Song
        let CurrentSong   = queue[0];
        //define Next Song
        let NextSong      = queue[1];
        //test if you can play a Song on that voiceConnection if not return
        if(!voiceConnection || voiceConnection.speaking === true || queue.length === 0) return;
        //await the download of that Song
        try {
            await this.handleDownload(CurrentSong)
        }catch(error) {
            channel.send(`I had an error while trying to download the Current Song so i skipped it the reason was following ${error.message}`)
            console.error(error)
            queue.shift()
            return this.playqueue(channel);
        }
        //if Queue has 2 or more Songs Download the next also
        if(queue.length > 1) this.handleDownload(NextSong);
        //get some stuff from the Info object we need
        const id          = CurrentSong.video_id
        const title       = CurrentSong.title
        const author      = CurrentSong.requestedBy
        //get the Dispatcher
        const dispatcher  = voiceConnection.playFile(`../audio_cache/${id}.aac`, {"volume": 0.5})
        //output from the start event
        dispatcher.on('start', () => {
            channel.send(`**Start playing:** ${title} Requested by **${author.tag}**`)
            voiceConnection.player.streamingData.pausedTime = 0;
            }
        )
        //log if the error event is emitted
        dispatcher.on('error', error => {
                channel.send("I had an error while trying to play the Current Song so i skipped it! if this happens more than 1 time please contact my DEV!");
                queue.shift();
                console.error(error);
                return this.playqueue(channel);
            }
        )
        //output form the end event + delete the current played Song also loop this function
        dispatcher.on('end', () => {
            channel.send(`**Finished playing:** ${title}`);
            queue.shift();
            this.playqueue(channel);
        })
    }

    static handleDownload(SongInfo) {
        return new Promise((resolve, reject) => {
            if(fs.existsSync(`../audio_cache/${SongInfo.video_id}.aac`) === false) {
                try{
                    yt.downloadFromInfo(SongInfo, {'filter': 'audioonly'})
                    .pipe(fs.createWriteStream(`../audio_cache/${SongInfo.video_id}.aac`)
                        .on('finish', () => {
                                resolve();
                            }
                        )
                        .on('error', error => {
                                reject(error)
                            }
                        )
                    )
                }catch(error) {
                    reject(error);
                }
            } else {
                resolve();
            }
        })
    }

    static getInfo(url) {
        return new Promise((resolve, reject) => {
            try{
                yt.getInfo(url, (err, result) => {
                    if (err || result.video_id === undefined) return reject(err)
                    resolve(result)
                })
            }catch(error){
                reject(error)
            }
        })
    }

    static getByName(songname) {
        return new Promise((resolve, reject) => {
            search(songname, searchopts, (err, result) => {
                if (err) return reject(err)
                let song = result[0]
                let index = 0;
                while(song.kind !== "youtube#video") {
                    index += 1
                    song = result[index]
                }
                resolve(song)
            })
        })
    }

    static getPlaylist(playlistID) {
        return new Promise((resolve, reject) => {
            try{
                ypi.playlistInfo(googleAPIKey, playlistID, playlistItems => {
                    //if no playlist is there ypi got an Error
                    if(!playlistItems) return reject(new Error("Invalid playlist"))
                    //if no error resolve with Playlist
                    resolve(playlistItems)
                })
            }catch(error){
                reject(error)
            }
        })
    }

    static handleSong(input, isLink, queue, requestedBy) {
        return new Promise(async (resolve, reject) => {
            if(isLink) {
                try{
                    let songinfo = await this.getInfo(input)
                    const length = Number(songinfo.length_seconds)
                    if(length > 1800) throw new Error("Song is too long!")
                    songinfo.requestedBy = requestedBy
                    queue.push(songinfo)
                    resolve(`**Queued:** ${songinfo.title}`)
                }catch(error){
                    reject(error)
                }
            }else{
               try{
                    const result = await this.getByName(input)
                    const songresult = await this.getInfo(result.link)
                    const length = Number(songresult.length_seconds)
                    if(length > 1800) throw new Error("Song is too long!")
                    songresult.requestedBy = requestedBy
                    queue.push(songresult)
                    resolve(`**Queued:** ${songresult.title}`)
               }catch(error){
                    reject(error)
               }
            }
        })
    }

    static handlePlaylist(link, queue, requestedBy) {
        return new Promise(async (resolve, reject) => {
            try{
                let playlistID = link.slice(38)
                const playlist = await this.getPlaylist(playlistID)
                let SongsAdded = 0;
                let SongsTooLong = 0;
                let SongsClaimed = 0;
                for(let song of playlist) {
                    const url = "https://www.youtube.com/watch?v=" + song.resourceId.videoId
                    try{
                        const result = await this.getInfo(url)
                        const length = Number(result.length_seconds)
                        if(length > 1800) throw new Error("Song is too long!")
                            result.requestedBy = requestedBy
                        queue.push(result)
                        SongsAdded++
                    }catch(error){
                        if(error.message === "Song is too long!") {
                            SongsTooLong++
                        }else{
                            SongsClaimed++
                        }
                    }
                }
                resolve(`${SongsAdded} Songs were added, ${SongsTooLong} Songs are to long, ${SongsClaimed} Songs are claimed/taken down`)
            }catch(error){
                reject(error)
            }
        })
    }
}

module.exports = Music
