const { Command } = require('klasa');


module.exports = class HugCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '[member:member]',
			botPerms: ['ATTACH_FILES'],
			description: 'Hug someone or get hugged'
		});
	}

	async run(msg, [member]) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(new this.client.methods.Embed()
			.setDescription(member ? `${msg.member} hugged ${member}` : `${msg.member} got hugged`)
			.setImage(url)
		);
	}
};
