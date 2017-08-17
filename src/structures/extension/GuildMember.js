const Extension = require('./Extend.js')
const permissionLevel = require('../new/Permissions.json')

class GuildMemberExtension extends Extension {

    getPermissionsLevel(client) {
        return new Promise(async (resolve, reject) => {
            if (this.id === client.config.ownerID) return resolve(permissionLevel.BOTOWNER)
            if (this.id === this.guild.owner.id) return resolve(permissionLevel.SERVEROWNER)
            const database = client.db
            try{
                const guildConfig = await database.guild.getByID(this.guild.id)
                for(let role of this.roles) {
                    if(guildConfig.moderationRolesIDs.includes(role[0])) return resolve(permissionLevel.MODERATORROLE)
                }
                for(let role of this.roles) {
                    if(guildConfig.musicRolesIDs.includes(role[0])) return resolve(permissionLevel.MUSICROLE)
                }
                resolve(permissionLevel.NOTHING)
            }catch(error) {
                reject(error)
            }
        })
    }

    updateEconomy(client, cash, bank) {
        return new Promise(async (resolve, reject) => {
            try{
                await client.db.money.updateData(`${this.id}${this.guild.id}`, {
                    cash,
                    bank
                })
                resolve()
            }catch(error){
                reject(error)
            }
        })
    }

    getEconomy(client) {
        return new Promise(async (resolve, reject) => {
            try{
                const data = await client.db.money.getByID(`${this.id}${this.guild.id}`)
                if(!data) return reject(new Error("this user did not registered for the economy system!"))
                resolve(data)
            }catch(error){
                reject(error)
            }
        })
    }

    addToEconomy(client) {
        return new Promise(async (resolve, reject) => {
            try{
                const test = await client.db.money.getByID(`${this.id}${this.guild.id}`)
                if(test) return reject(new Error("already registered"))
                await client.db.money.insertDate({
                    "id": `${this.id}${this.guild.id}`,
                    "guildID": this.guild.id,
                    "cash": 0,
                    "bank": 0

                })
                resolve()
            }catch(error){
                reject(error)
            }
        })
    }
}

module.exports = GuildMemberExtension
