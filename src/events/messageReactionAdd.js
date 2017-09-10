const Events = require('../structures/new/Event.js')
const {RichEmbed} = require('discord.js')

class MessageReactionAddEvent extends Events {
    constructor(client) {
        super(client)
        this.name = 'messageReactionAdd'
    }

    async run(messageReaction, user) {
        try{
            if(user.bot) return
            if(messageReaction.emoji.name !== "⭐") return
            const message = messageReaction.message
            const guild = message.guild
            if(message.author.id === user.id) return;
            if(!guild) return
            const starboardMessages = await guild.getStarboardMessages(this.client)
            if(starboardMessages.includes(message.id)) return;
            const serverConfig = await guild.getConfig(this.client)
            let neededReactions = 1;
            if(serverConfig.starboardNeededReactions) {
                neededReactions = serverConfig.starboardNeededReactions
            }
            await messageReaction.fetchUsers()
            const reactionCount = messageReaction.count
            if(reactionCount < neededReactions) return;
            const embed = new RichEmbed()
                .setAuthor(`${message.author.username}`)
                .setThumbnail(message.author.displayAvatarURL)
                .addField(`ID:`, `${message.id}`, true)
                .addField('Channel', `${message.channel}`, true)
                .addField(`Message:`, `**${message.content}**`, true)
                .setTimestamp()
                .setFooter(`${reactionCount}⭐`)
                .setColor(0x80ff00)
            if(message.attachments.size === 1) {
                if(/\.(gif|jpg|jpeg|tiff|png)$/i.test(message.attachments.first().filename)) embed.setImage(`${message.attachments.first().url}`)
            }
            const channel = guild.channels.get(serverConfig.starboardID)
            if(channel) {
                const Message = await channel.send({embed})
                const collector = message.createReactionCollector(reaction => reaction.emoji.name === '⭐', {"time": 60000})
                collector.on('collect', async reaction => {
                    const embed = new RichEmbed()
                    .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL}`)
                    .addField(`ID:`, `${message.id}`)
                    .addField('Channel', `${message.channel}`)
                    .addField(`Message:`, `${message.content}`)
                    .setTimestamp()
                    .setFooter(`${reaction.count}⭐`)
                    .setColor(0x80ff00)
                    if(/\.(gif|jpg|jpeg|tiff|png)$/i.test(message.attachments.first().filename)) embed.setImage(`${message.attachments.first().url}`)
                    await Message.edit({embed})
                });
                await guild.addStarboardMessage(this.client, message.id)
            }
        }catch(error){
            this.client.log.error(`${error.name}: ${error.message}`);
        }
    }
}

module.exports = MessageReactionAddEvent
