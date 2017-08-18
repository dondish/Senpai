const fs = require('fs');
const yt = require('ytdl-core');
const ypi = require('youtube-playlist-info');
const {googleAPIKey} = require('../config/config.json')
const search = require('youtube-search');
const searchopts = {
    "maxResults": 10,
    "key": googleAPIKey
};


class Music {

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
                    if(err) return reject(err)
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

    static handleSong(input, isLink, queue) {
        return new Promise(async (resolve, reject) => {
            if(isLink) {
                try{
                    const songinfo = await this.construtor.getInfo(input)
                    const length = Number(songinfo.length_seconds)
                    if(length > 1800) throw new Error("Song is too long!")
                    queue.push(songinfo)
                    resolve(songinfo)
                }catch(error){
                    reject(error)
                }
            }else{
               try{
                    const result = await this.construtor.getByName(input)
                    const songresult = await this.construtor.getInfo(result.link)
                    const length = Number(songresult.length_seconds)
                    if(length > 1800) throw new Error("Song is too long!")
                    queue.push(songresult)
                    resolve(songresult)
               }catch(error){
                    reject(error)
               }
            }
        })
    }

    static handlePlaylist(link, queue) {
        return new Promise(async (resolve, reject) => {
            try{
                let playlistID = link.slice(38)
                const playlist = await this.construtor.getPlaylist(playlistID)
                let SongsAdded = 0;
                let SongsTooLong = 0;
                let SongsClaimed = 0;
                for(let song of playlist) {
                    const url = "https://www.youtube.com/watch?v=" + song.resourceId.videoId
                    try{
                        const result = await this.construtor.getInfo(url)
                        const length = Number(result.length_seconds)
                        if(length > 1800) throw new Error("Song is too long!")
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
