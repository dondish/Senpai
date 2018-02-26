const { walk } = require('file');
const { promisify: utilPromisify } = require('util');

class Util {
	constructor(Client) {
		this.client = Client;
	}

	static colors(type) {
		const colors = {
			Banned: 'RED',
			Ban: 'RED',
			Softbanned: 'DARK_ORANGE',
			Softban: 'DARK_ORANGE',
			Kicked: 'DARK_GREEN',
			Kick: 'DARK_GREEN',
			Muted: 'BLUE',
			Mute: 'Blue',
			Warn: 'NAVY',
			Warned: 'NAVY'
		};
		return colors[type];
	}

	static promisify(func) {
		return utilPromisify(func);
	}

	static walkAsync(path) {
		return new Promise((resolve, reject) => {
			walk(path, (err, ...result) => {
				if (err) return reject(err);
				resolve(result);
			});
		});
	}
}

module.exports = Util;
