const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'reason',
	description: 'changes the reason of a moderation case',
	aliases: [],
	examples: ['reason 50 spam', 'reason 24 Ads']
};

class ReasonCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, args) {
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel >= 3) return msg.reply('You dont have permission to use this Command!');
		if (args.length < 2) return msg.reply('you need to provide atleast a case number to change and a new reason');
		let caseNumberS = args[0].toLowerCase();
		const reason = args.slice(1).join(' ');
		const latestcase = await msg.guild.latestCase();
		const { modlogChannel } = await msg.guild.getConfig();
		let caseNumber;
		if (caseNumberS === 'latest') {
			caseNumber = latestcase;
		} else if (!Number.isNaN(Number(caseNumberS))) {
			caseNumber = Number(caseNumberS);
		} else {
			return msg.reply('The first parameter has to be a valid case number');
		}
		const channel = msg.guild.channels.get(modlogChannel);
		if (!channel) return msg.reply('You need to set a modlog where the moderation cases has to be sent to edit a reason!');
		await msg.guild.updateCase({ channel, reason, caseNumber });
	}
}

module.exports = ReasonCommand;
