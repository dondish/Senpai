const Extension = require('./Extend.js')

class GuildExtension extends Extension {

    getLeaderboard(client) {
        return new Promise(async (resolve, reject) => {
            try{
                const data = await client.db.money.filterAndSort({"guildID": this.id}, element => element('bank') + element('cash'))
                data.length = 9
                resolve(data)
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
                const result = await client.db.guild.insertDate({
                    "moderationRolesIDs": [] ,
                    "modlogID":  "None" ,
                    "musicID":  "None" ,
                    "musicRolesIDs": [] ,
                    "starboardID":  "None" ,
                    "prefix":  "None" ,
                    "id":  this.id
                 })
                 resolve(result)
            }catch(error){
                reject(error)
            }
        })
    }

    getQueue() {
        const queue = this.queue
        return queue || []
    }

    pushToQueue(element) {
        if(!element) throw new Error('you didn`t supplied a element to push to the Queue')
        const queue = this.queue || []
        queue.push(element)
        if(!queue) this.queue = queue
    }

    addToQueue(element, index) {
        if(typeof index !== 'number') throw new TypeError('index must be a number')
        if(!element) throw new Error('you didn`t supplied a element to add to the Queue')
        const queue = this.queue || []
        queue.splice(index, 0, element)
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
