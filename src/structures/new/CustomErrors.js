class EconomyError extends Error {
	constructor(message, member) {
		super(message);
		this.member = member;
	}
}

class MusicError extends Error {
	constructor(message, msg) {
		super(message);
		this.msg = msg;
	}
}

module.exports = { EconomyError, MusicError };
