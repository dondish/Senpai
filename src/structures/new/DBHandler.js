const Table = require('./TableHandler.js');
const Structure = require('./dbStructure.json');
const rethink = require('rethinkdb');


class DBHandler {
	createConnection() {
		return new Promise((resolve, reject) => {
			rethink.connect()
				.then(connection => resolve(connection))
				.catch(err => reject(err));
		});
	}
	testDB() {
		return new Promise((resolve, reject) => {
			this.createConnection()
				.then(connection => {
					rethink.dbList().run(connection, (err, data) => {
						if (err) reject(err);
						if (data.includes(this.dbName)) {
							resolve();
						} else {
							this.createDB()
								.then(() => resolve())
								.catch(error => reject(error));
						}
					});
				})
				.catch(err => reject(err));
		});
	}

	createDB() {
		return new Promise((resolve, reject) => {
			this.createConnection()
				.then(connection => {
					rethink.dbCreate(this.dbName).run(connection, err => {
						if (err) reject(err);
						resolve();
					});
				})
				.catch(err => reject(err));
		});
	}
	constructor(dbName) {
		this.dbName = dbName || 'Discord';
		if (typeof this.dbName !== 'string') throw new TypeError('Database name must be an string!');
		this.testDB()
			.then(() => {
				for (let table in Structure) {
					if (Structure.hasOwnProperty(table)) {
						this[table] = new Table(table, Structure[table], this.dbName);
					}
				}
			})
			.catch(err => { throw err; });
	}
}

module.exports = DBHandler;
