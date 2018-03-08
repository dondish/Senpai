class MusicError extends Error {

}

class DatabaseError extends Error {

}

class UsageError extends Error {

}

module.exports = { MusicError, DatabaseError, UsageError };
