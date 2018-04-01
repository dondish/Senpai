const { Command } = require('klasa');


module.exports = class DanceCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '[member:member]',
			botPerms: ['ATTACH_FILES'],
			description: 'Want to dance?'
		});
	}

	async run(msg, [member]) {
		const { url } = await this.wolkeHandler.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(
			new this.client.methods.Embed()
				.setDescription(member ? `${msg.member} danced with ${member}` : `${msg.member} started to dance`)
				.setImage(url)
		);
	}
};
