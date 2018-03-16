const { Command } = require('klasa');
const figlet = require('figlet');

module.exports = class AsciiCommand extends Command {
	constructor(...args) {
		super(...args, {
			name: 'ascii',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 5,
			bucket: 1,
			permLevel: 0,
			usage: '<text:str>',
			description: 'Generates Ascii Art out of your text'
		});
	}

	async run(msg, [...text]) {
		return msg.send(await this.create(text), { code: 'ascii' });
	}

	create(text) {
		return new Promise((resolve, reject) => {
			figlet(text, (err, data) => {
				if (err) return reject(err);
				resolve(data);
			});
		});
	}
};
