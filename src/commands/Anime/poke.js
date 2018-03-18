const { Command } = require('klasa');


module.exports = class PokeCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '[member:member]',
			botPerms: ['ATTACH_FILES'],
			description: 'Poke someone or get poked'
		});
	}

	async run(msg, [member]) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(new this.client.methods.Embed()
			.setDescription(member ? `${msg.member} poked ${member}` : `${msg.member} got poked`)
			.setImage(url)
		);
	}
};
