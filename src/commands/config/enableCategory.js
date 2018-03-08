const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'enabledcategory',
	description: 'enables all commands of an Category"',
	aliases: [],
	examples: ['enabledcategory economy', 'enabledcategory music']
};

class EnableCategoryCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, args) {
		const permissionLevel = await msg.member.getPermissionsLevel();
		if (permissionLevel > 3) return msg.reply("You dont have permission to do that since you dont have a moderation Role and also aren't the Owner of this server!");
		const { disabledCommandCategories } = await msg.guild.getConfig();
		let category = args[0];
		if (!category) return msg.reply('You need to add a Category to enable behind!');
		category = category.toLowerCase();
		if (!this.client.categories.includes(args[0])) return msg.reply(`Im sorry but this Category doesn't exist, the possible options are ${this.client.categories.join(', ')}`);
		if (!disabledCommandCategories.includes(args[0])) return msg.reply('This Category is already enabled on this server!');
		if (['config', 'others'].includes(category)) return msg.reply('You cannot enbale/disable the Categories config and others for securiy reasons!');
		disabledCommandCategories.splice(disabledCommandCategories.indexOf(category), 1);
		await msg.guild.updateConfig({ disabledCommandCategories });
		return msg.channel.send(`Sucessfully enabled ${category} on ${msg.guild.name}`);
	}
}

module.exports = EnableCategoryCommand;
