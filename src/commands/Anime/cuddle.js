const { Command } = require('klasa');


module.exports = class CuddleCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '[member:member]',
			botPerms: ['ATTACH_FILES'],
			description: 'Cuddle someone or get cuddled'
		});
	}

	async run(msg, [member]) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(new this.client.methods.Embed()
			.setDescription(member ? `${msg.member} cuddled ${member}` : `${msg.member} got cuddled`)
			.setImage(url)
		);
	}
};
