class MusicError extends Error {
	constructor(message, msg) {
		super(message);
		this.name = this.constructor.name;
		this.msg = msg;
	}
}

class DatabaseError extends Error {

}

class UsageError extends Error {

}

module.exports = { MusicError, DatabaseError, UsageError };
