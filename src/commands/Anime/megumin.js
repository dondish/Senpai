const { Command } = require('klasa');


module.exports = class MeguminCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			botPerms: ['ATTACH_FILES'],
			description: 'MEGUMIN EXPLOSION!'
		});
	}

	async run(msg) {
		const { url } = await this.client.weebAPI.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(
			new this.client.methods.Embed()
				.setDescription('MEGUMIN EXPLOSION!!!')
				.setImage(url)
		);
	}
};
