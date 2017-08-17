const Discord = require('discord.js')
const SenpaiClient = require('./structures/extension/Client.js')
const GuildExtension = require('./structures/extension/Guild.js')
const GuildMemberExtension = require('./structures/extension/GuildMember.js')
const UserExtension = require('./structures/extension/User.js')
const eventloader = require('./util/Eventloader.js')
const commandloader = require('./util/Commandloader.js')

GuildExtension.extend(Discord.Guild)
GuildMemberExtension.extend(Discord.GuildMember)
UserExtension.extend(Discord.User)

const Client = new SenpaiClient({'disabledEvents': ['TYPING_START']})

commandloader(Client)

eventloader(Client)

Client.login(Client.config.bottoken);

process.on('unhandledRejection', function(reason, promise){
    console.log("Possibly Unhandled Rejection at: Promise ", promise, " reason: ", reason);
});
