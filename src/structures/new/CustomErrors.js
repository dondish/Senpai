class MusicError extends Error {
	constructor(message, msg) {
		super(message);
		this.msg = msg;
	}
}

class DatabaseError extends Error {

}

module.exports = { MusicError, DatabaseError };
