const { Command } = require('klasa');


module.exports = class HandholdingCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '[member:member]',
			botPerms: ['ATTACH_FILES'],
			description: 'Hold someones hand or hold my hand'
		});
	}

	async run(msg, [member]) {
		const { url } = await this.wolkeHandler.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(new this.client.methods.Embed()
			.setDescription(member ? `${msg.member} grabs ${member}'s hand` : `${msg.member} Hold my hand ^.^`)
			.setImage(url)
		);
	}
};
