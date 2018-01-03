class MusicError extends Error {
	constructor(message, msg) {
		super(message);
		this.msg = msg;
	}
}

module.exports = { MusicError };
