const Discord = require('discord.js');
const SenpaiClient = require('./structures/extension/Client.js');
const GuildExtension = require('./structures/extension/Guild.js');
const GuildMemberExtension = require('./structures/extension/GuildMember.js');
const UserExtension = require('./structures/extension/User.js');
const Util = require('./structures/new/Util.js');

GuildExtension.extend(Discord.Guild);
GuildMemberExtension.extend(Discord.GuildMember);
UserExtension.extend(Discord.User);

const Client = new SenpaiClient({ disabledEvents: ['TYPING_START'] });
const loader = new Util(Client);

loader.init().then(() => Client.login(Client.config.bottoken).catch(err => Client.log.error(`${err.name}: ${err.message}`))).catch(err => { throw err; });

process.on('unhandledRejection', (reason, promise) => {
	console.log('Possibly Unhandled Rejection at: Promise ', promise, ' reason: ', reason.message);
});
