const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'disablecategory',
	description: 'disables all commands of an Category"',
	aliases: [],
	examples: ['disablecategory economy', 'disablecategory music']
};

class DisableCategoryCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, args) {
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel > 3) return msg.reply("You dont have permission to do that since you dont have a moderation Role and also aren't the Owner of this server!");
		const { disabledCommandCategories } = await msg.guild.getConfig();
		let category = args[0];
		if (!category) return msg.reply('You need to add a Category to disable behind!');
		category = category.toLowerCase();
		if (!this.client.categories.includes(args[0])) return msg.reply(`Im sorry but this Category doesn't exist, the possible options are ${this.client.categories.join(', ')}`);
		if (disabledCommandCategories.includes(args[0])) return msg.reply('This Category is already disabled on this server!');
		if (['config', 'others'].includes(category)) return msg.reply('You cannot disable the Categories config and others for securiy reasons!');
		disabledCommandCategories.push(category);
		await msg.guild.updateConfig({ disabledCommandCategories });
		return msg.channel.send(`Sucessfully disabled ${category} on ${msg.guild.name}`);
	}
}

module.exports = DisableCategoryCommand;
