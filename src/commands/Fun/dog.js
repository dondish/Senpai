const { Command } = require('klasa');


module.exports = class DoggoCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['doggo', 'pupper', 'puppy', 'pup'],
			botPerms: ['ATTACH_FILES'],
			description: 'Doggo'
		});
	}

	async run(msg) {
		const { url } = await this.wolkeHandler.getRandom({ type: `animal_${this.name}`, hidden: false, nsfw: false });
		return msg.send(new this.client.methods.Embed().setImage(url));
	}
};
