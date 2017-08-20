const Events = require('../structures/new/Event.js')

class MessageUpdateEvent extends Events {
    constructor(client) {
        super(client)
        this.name = 'messageUpdate'
    }

    async run(oldMessage, newMessage) {
        const client = this.client;
        if(oldMessage.content === newMessage.content) return;
        const msg = newMessage
        if(msg.author.bot) return;
        const blacklisted = await msg.author.isBlacklisted(client);
        if(blacklisted) return;
        if(!msg.guild) return;
        let guildConfig = await msg.guild.getConfig(client)
        if(guildConfig.prefix === "None") guildConfig.prefix = undefined
        const prefix = guildConfig.prefix || client.config.prefix
        if(!msg.content.startsWith(prefix)) return;
        const params = this.constructor.createParams(msg)
        const command = this.constructor.getCommand(msg, prefix)
        let cmd;
        if (client.commands.has(command)) {
            cmd = client.commands.get(command);
        } else if(client.aliases.has(command)) {
            cmd = client.commands.get(client.aliases.get(command));
        }
        if(cmd) {
            try{
                await cmd.run(msg, params, prefix)
                this.client.emit('commandRun', this, msg)
            }catch(error){
                this.client.emit('commandError', error, this, msg)
                const Owner = this.client.users.get(this.client.config.ownerID)
                const invite = this.client.config.supportServerLink
                msg.reply(`An error occurred while running the command: \`${error.name}: ${error.message}\`
You shouldn't ever receive an error like this.
Please contact ${Owner.tag}${invite ? ` in this server: ${invite}` : '.'}`)
            }
        }

    }

    static createParams(msg) {
        const params = msg.content.split(' ').slice(1);
        return params
    }

    static getCommand(msg, prefix) {
        const command = msg.content.split(' ')[0].slice(prefix.length).toLowerCase()
        return command
    }
}

module.exports = MessageUpdateEvent
