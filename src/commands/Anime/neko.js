const { Command } = require('klasa');


module.exports = class NekoCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			botPerms: ['ATTACH_FILES'],
			description: 'Cute neko'
		});
	}

	async run(msg) {
		const { url } = await this.wolkeHandler.getRandom({ type: this.name, hidden: false, nsfw: false });
		return msg.send(new this.client.methods.Embed().setImage(url));
	}
};
