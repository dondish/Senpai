class MusicError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
	}
}

class DatabaseError extends Error {

}

class UsageError extends Error {

}

module.exports = { MusicError, DatabaseError, UsageError };
