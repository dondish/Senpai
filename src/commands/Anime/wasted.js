const { Command } = require('klasa');


module.exports = class WastedCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			botPerms: ['ATTACH_FILES'],
			usage: '[member:member]',
			description: 'WASTED.'
		});
	}

	async run(msg, [member]) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(
			new this.client.methods.Embed()
				.setDescription(member ? `${msg.member} just killed ${member}` : `${msg.member} got wasted`)
				.setImage(url)
		);
	}
};
