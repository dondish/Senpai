const { Command } = require('klasa');


module.exports = class HighfiveCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '[member:member]',
			botPerms: ['ATTACH_FILES'],
			description: 'Give or get high five'
		});
	}

	async run(msg, [member]) {
		const { url } = await this.wolkeHandler.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(new this.client.methods.Embed()
			.setDescription(member ? `${msg.member} gave ${member} high fives` : `${msg.member} got high fives`)
			.setImage(url)
		);
	}
};
