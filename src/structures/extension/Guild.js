const Extension = require('./Extend.js')
const rethink = require('rethinkdb')

class GuildExtension extends Extension {

    getLeaderboard(client) {
        return new Promise(async (resolve, reject) => {
            try{
                const data = await client.db.money.filterAndSort({"guildID": this.id}, rethink.desc(function(element) {
                    return rethink.add(element('cash'), element('bank'))
                  })
                )
                resolve(data)
            }catch(error){
                reject(error)
            }
        })
    }

    getStarboardMessages(client) {
        return new Promise(async (resolve, reject) => {
            try{
                let result = await client.db.starboardMessages.getByID(this.id)
                if(!result) {
                    await client.db.starboardMessages.insertData({
                        'id': this.id,
                        'messages': []
                    })
                    result = await client.db.starboardMessages.getByID(this.id)
                }
                resolve(result.messages)
            }catch(error){
                reject(error)
            }
        })
    }

    addStarboardMessage(client, id) {
        return new Promise(async (resolve, reject) => {
            try{
                let result = await client.db.starboardMessages.getByID(this.id)
                result.messages.push(id)
                await client.db.starboardMessages.updateData(this.id, {'messages': result.messages})
                resolve()
            }catch(error){
                reject(error)
            }
        })
    }

    getConfig(client) {
        return new Promise(async (resolve, reject) => {
            try{
                const config = await client.db.guild.getByID(this.id)
                resolve(config)
            }catch(error) {
                reject(error)
            }
        })
    }

    createConfig(client) {
        return new Promise(async (resolve, reject) => {
            try{
                const result = await client.db.guild.insertData({
                    "moderationRolesIDs": [] ,
                    "modlogID":  "None" ,
                    "musicID":  "None" ,
                    "musicRolesIDs": [] ,
                    "starboardID":  "None" ,
                    "prefix":  "None" ,
                    "musicLimited": false,
                    "id":  this.id
                 })
                 resolve(result)
            }catch(error){
                reject(error)
            }
        })
    }

    updateConfig(client, data) {
        return new Promise(async (resolve, reject) => {
            try{
                const result = await client.db.guild.updateData(this.id, data)
                resolve(result)
            }catch(error){
                reject(error)
            }
        })
    }

    getLoop() {
        if(this.loop === undefined) this.loop = false
        return this.loop
    }

    setLoop(boolean) {
        this.loop = boolean
    }

    getQueue() {
        const queue = this.queue
        if(!queue) {
            this.queue = []
        }
        return this.queue
    }

    shiftQueue() {
        const queue = this.queue || []
        if(!queue) return
        const shifted = queue.shift()
        return shifted
    }

    removeFromQueue(index) {
        if(typeof index !== 'number') throw new TypeError('index must be a number')
        const queue = this.queue || []
        if(!queue) return
        const element = queue.splice(index, 1);
        return element
    }

    overwriteQueue(array) {
        this.queue = array
    }
  }

module.exports = GuildExtension
