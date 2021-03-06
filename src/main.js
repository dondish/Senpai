const Discord = require('discord.js');
const SenpaiClient = require('./structures/extension/Client.js');
const GuildExtension = require('./structures/extension/Guild.js');
const GuildMemberExtension = require('./structures/extension/GuildMember.js');
const Setup = require('./structures/new/Setup.js');

GuildExtension.extend(Discord.Guild);
GuildMemberExtension.extend(Discord.GuildMember);

const Client = new SenpaiClient({ disabledEvents: ['TYPING_START'] });
const setup = new Setup(Client);

setup.init()
	.then(() => Client.login(Client.config.bottoken)
		.catch(err => Client.log.error(`${err.name}: ${err.message}`)))
	.catch(err => { throw err; });

process.on('unhandledRejection', (reason, promise) => {
	console.log('Possibly Unhandled Rejection at: Promise ', promise, ' reason: ', reason.message);
});
