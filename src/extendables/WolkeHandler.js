const { Extendable } = require('klasa');
const WolkeHandler = require('wolken');

module.exports = class extends Extendable {
	constructor(...args) {
		super(...args, {
			appliesTo: ['Command'],
			name: 'wolkeHandler',
			enabled: true,
			klasa: true
		});
	}

	get extend() {
		if (!this._wolkeHandler) this._wolkeHandler = new WolkeHandler(this.client.tokens.wolkeToken, 'Wolke');
		return this._wolkeHandler;
	}
};

