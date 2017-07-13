//Imports we need
const fs                                    = require('fs');
const async                                 = require('async')
const yt                                    = require('ytdl-core');
const config                                = require('../config/config.json')
let   ypi                                   = require('youtube-playlist-info');
const search                                = require('youtube-search');
const searchopts                            = {
      "maxResults": 10,
      "key": config.GoogleApiKey
};

//Shuffle function
function shuffle(queue) {
    let currentIndex = queue.length,
    randomIndex,
    temporaryValue;
   //While there remain elements to shuffle...
   while (currentIndex !== 0) {

     //Pick a remaining element...
     randomIndex = Math.floor(Math.random() * currentIndex);
     currentIndex -= 1;

    //And swap it with the current element.
     temporaryValue = queue[currentIndex];
     queue[currentIndex] = queue[randomIndex];
     queue[randomIndex] = temporaryValue;
   }

   return queue;
 }
//Storage for the queues
let queues = {};
//Storage for the Dispatcher
let dispatchers = {};


//function to get the current queue
function getqueue(ID){
    if (!queues[ID]) queues[ID] = [];
    return queues[ID];
}

//function to get the current Dispatcher
function getDispatcher(ID) {
    if (!dispatchers[ID]) dispatchers[ID] = []
    return dispatchers[ID]
}
//format function
function format(seconds){
    function pad(seconds3){
        return (seconds3 < 10 ? '0' : '') + seconds3;
    }
    let hours = Math.floor(seconds / (60*60));
    let minutes = Math.floor(seconds % (60*60) / 60);
    let seconds2 = Math.floor(seconds % 60);
        return pad(hours) + 'h:' + pad(minutes) + 'm:' + pad(seconds2)+ 's';
}

//export the shuffle function
 exports.shufflequeue = msg => {
     let queue = getqueue(msg.guild.id);
     if (queue.length < 2) return msg.channel.send("You need atleast 2 songs in the queue to shuffle!")
        queues[msg.guild.id] = shuffle(queue);
        msg.channel.send("successfully shuffled the queue!")
 }
//export queue function
exports.queue = msg => {
    let queue = getqueue(msg.guild.id);
    if(queue.length < 1) {
        msg.reply("there are no songs currently in queue!")
    }else{
        //Print the total amount of time in the playlist
        let totalTimeInSec = 0;

        //Get the length of every song in seconds
        const songsLength = queue.map(Song => Number(Song.length_seconds));

        //Add all the lengths into totalTimeInSec
        for (let i = 0; i < songsLength.length; i++) {
            totalTimeInSec += songsLength[i];
        }
        const time = format(Math.floor(totalTimeInSec))
        const songs = queue.map(Song => `${Song.title} requested by **${Song.requestedBy.username}**`)
        if(songs.length > 15) {
            let before = songs.length
            songs.length = 15;
            songs[15] = `**and ${before - 15} songs more...**\n`
            songs[16] = `**total length: ${time}**`
            msg.channel.send(songs.join("\n"))
        } else {
            msg.channel.send(songs.join("\n"))
            msg.channel.send(`**total length: ${time}**`)
        }
    }
}
//export showVolume function
exports.showVolume = msg => {
    let getdispatcher = getDispatcher(msg.guild.id)
    let dispatcher       = getdispatcher[0]
    if(dispatcher === undefined) return msg.channel.send("i dont play music at the moment!")
    msg.channel.send(`the current volume is ${dispatcher.volume}`)
}
//export changeVolume function
exports.changeVolume = (msg, number) => {
    let dispatchertochange = getDispatcher(msg.guild.id)
    let dispatcher       = dispatchertochange[0]
    if(dispatcher === undefined) return msg.channel.send("i dont play music at the moment!")
    dispatcher.setVolumeLogarithmic(number)
    msg.channel.send(`You set the Volume to ${number}`)
}
//export clearqueue function
exports.clearqueue = msg => {
    let queue = getqueue(msg.guild.id);
    if (queue.length > 0) {
        queue.length = 0
    }
}
//export deleteSong function
exports.deletesong = (msg, number) => {
    let queue = getqueue(msg.guild.id);
    if (number <= 0) return msg.channel.send("There is no Song which is in queue place 0 or less :thinking:")
    if (number > queue.length) return msg.channel.send("You can't try to delete a song that is not there!")
    const indexnumber = number - 1
    msg.channel.send(`I've deleted the Song ${queue[indexnumber].title} from the queue`)
    queue.splice(indexnumber, 1)
}
//export skip function
exports.skip = msg => {
    let dispatchertoskip = getDispatcher(msg.guild.id)
    let dispatcher       = dispatchertoskip[0]
    if(dispatcher === undefined) return msg.channel.send("i dont play music at the moment!")
    dispatcher.end()
    msg.channel.send("Skipped the played Song!")

}

exports.disconnect = msg => {
    let queue = getqueue(msg.guild.id);
    if (queue.length > 0) {
        queue.length = 0
    }
    if (msg.guild.voiceConnection.speaking === true) {
            let dispatchertoskip = getDispatcher(msg.guild.id)
            let dispatcher       = dispatchertoskip[0]
            dispatcher.end()
    }
}
//get playlist function returns a promise
function getPlaylist(ApiKey, playlistID) {
    return new Promise(function(resolve, reject) {
        ypi.playlistInfo(ApiKey, playlistID, playlistItems => {
            //if no playlist is there ypi got an Error
            if(!playlistItems) return reject(new Error("Invalid playlist"))
            //if no error resolve with Playlist
            resolve(playlistItems)
        })
    })
}
//this function add every Song to the playlist
function addEverySong(Songs, queue, member) {
    //returns a promise
    return new Promise(function(resolve, reject) {
        //some variables we need
        let SongsAdded = 0;
        let SongsToLong = 0;
        let SongsClaimed = 0;
            //call an async forEach so we get when its done
            async.each(Songs, function(Song, callback) {
                //construct out URL
                const URL = "https://www.youtube.com/watch?v=" + Song.resourceId.videoId
                //get info about that Song
                yt.getInfo(URL, (err, info) => {
                    //if error return and increase SongsClaimed
                    if(err) {
                        SongsClaimed++;
                        //return with the call its done
                        return callback();
                    }
                    //if toLong return and increase SongsToLong
                    if(Number(info.length_seconds) > 1800)  {
                        SongsToLong++
                        //return with the call its done
                        return callback();
                    }
                    //attach the member who requested the Song on the info object
                    info.requestedBy = member.user;
                    //add it to the queue
                    queue.push(info);
                    //increase SongsAdded
                    SongsAdded++;
                    //call its done
                    callback();
                })
            }, function(err) {
                    if (err) reject(new Error("I had an fatal error please contact my DEV"))
                    resolve([SongsAdded, SongsToLong, SongsClaimed])
            });
    })
}

//add to queue function
exports.addtoqueue = (url, member) => new Promise(async function(resolve, reject) {
    //Test if the URL array has 1 or more Items
    if(url.length === 1) {
        let Link = url[0]
        //Test if its a Video
        if(Link.includes("watch") || Link.includes("youtu.be")) {
            //get info about that Video
            yt.getInfo(Link, (err, info) => {
                //if error reject the Promise
                if (err || info.video_id === undefined) return reject(new Error("get Info about that Song failed"))
                const length = Number(info.length_seconds)
                //if Video is longer than 30 mins reject it
                if(length > 1800) return reject(new Error("Video is longer than 30 minutes"))
                //get the username of the User who requested and add it to the info object
                info.requestedBy = member.user;
                //get the queue
                let queue = getqueue(member.guild.id);
                //add it to the queue
                queue.push(info);
                //resolve the Promise
                resolve([`**Queued:** ${info.title}`]);
            })
        //Test if its a Playlist
    }else if(Link.includes("playlist")) {
        //get the playlistID
        let playlistID = Link.slice(38)
        //get the current queue
        let queue = getqueue(member.guild.id)
        //try to await getPlaylist and addEverySong if error reject the current Promise with that error
        try{
        const playlist = await getPlaylist(config.GoogleApiKey, playlistID);
        const stats = await addEverySong(playlist, queue, member);
        resolve(stats);
        }catch(error){
            reject(error);
        }
        } else {
            //if its a Link but not from Youtube reject the Promise
            return reject(new Error("Url is not an Youtube Video/Playlist"))
        }
    } else {
        let Name = url.join(" ")
        //search for that Song
        search(Name, searchopts, function(error, result) {
            if(error) return reject(new Error("searching for that Song failed"));
            let firstResult = result[0];
            let index;
            //get the next object until its an Video
            while(firstResult.kind !== "youtube#video") {
                index += 1
                firstResult = result[index]
            }
            //get Info about that Video
            yt.getInfo(firstResult.link, (err, info) => {
                //if error reject the Promise
                if (err || info.video_id === undefined) return reject(new Error("get Info about that Song failed"))
                const length = Number(info.length_seconds)
                //if Video is longer than 30 mins reject it
                if(length > 1800) return reject(new Error("Video is longer than 30 minutes"))
                //get the username of the User who requested and add it to the info object
                info.requestedBy = member.user;
                //get the queue
                let queue = getqueue(member.guild.id);
                //add it to the queue
                queue.push(info);
                //resolve the Promise
                resolve([`**Queued:** ${info.title}`]);
            })
        })
    }
})
function downloadSong(SongInfo) {
    //return a Promise
    return new Promise(function(resolve, reject) {
        //test if the file already exists
        if(fs.existsSync(`./audio_cache/${SongInfo.video_id}.aac`) === false) {
            //if File not exist try to download the Song
             yt.downloadFromInfo(SongInfo, {'filter': 'audioonly'})
            //and write it to a file
            .pipe(fs.createWriteStream(`./audio_cache/${SongInfo.video_id}.aac`)
                //if finished resolve the promise
                .on('finish', () => {
                        resolve();
                    }
                )
                //if error occourd reject the promise with that error
                .on('error', error => {
                        reject(new Error(error))
                    }
                )
            )
        } else {
            //if file already exists resolve the Promise
            resolve();
        }
    })
}
async function playqueue(Guild, channel) {
    //define voiceConnection
    const voiceConnection = Guild.voiceConnection;
    //get current queue
    let queue = getqueue(Guild.id);
    //define current Song
    let CurrentSong   = queue[0];
    //define Next Song
    let NextSong      = queue[1];
    //test if you can play a Song on that voiceConnection if not return
    if(!voiceConnection || voiceConnection.speaking === true || queue.length === 0) return;
    //await the download of that Song
    try {
        await downloadSong(CurrentSong)
    }catch(error) {
        channel.send("I had an error while trying to download the Current Song so i skipped it!")
        queue.shift()
        return playqueue(Guild, channel);
    }
    //if Queue has 2 or more Songs Download the next also
    if(queue.length > 1) downloadSong(NextSong);
    //get some stuff from the Info object we need
    const dispatcherStorage = getDispatcher(Guild.id)
    const id          = CurrentSong.video_id
    const title       = CurrentSong.title
    const author      = CurrentSong.requestedBy
    //get the Dispatcher
    const dispatcher  = voiceConnection.playFile(`./audio_cache/${id}.aac`, {"volume": 0.4})
    //add the Dispatcher to the Storage
    dispatcherStorage.push(dispatcher)
    //output from the start event
    dispatcher.on('start', () => {
        channel.send(`**Start playing:** ${title} Requested by **${author.tag}**`)
            }
        )
    //log if the error event is emitted
    dispatcher.on('error', error => {
        console.error(error)
        }
    )
    //output form the end event + delete the current played Song aswell the current Dispatcher from the Storage also loop this function
    dispatcher.on('end', () => {
    channel.send(`**Finished playing:** ${title}`)
    queue.shift()
    dispatcherStorage.shift()
    playqueue(Guild, channel)
        }
    )
}

exports.playqueue = (Guild, channel) => {
    playqueue(Guild, channel)
}
