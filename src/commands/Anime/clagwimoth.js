const { Command } = require('klasa');

module.exports = class ClagWimothCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			botPerms: ['ATTACH_FILES'],
			description: 'What?'
		});
	}

	async run(msg) {
		const { url } = await this.wolkeClient.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(new this.client.methods.Embed().setImage(url));
	}
};
