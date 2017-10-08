const rethink = require('rethinkdb');

class TableHandler {
	readDate() {
		return new Promise(async (resolve, reject) => {
			const connection = await this.createConnection();
			const { tableName } = this;
			connection.use(this.dbName);
			rethink.table(tableName)
				.run(connection, (err, data) => {
					if (err) reject(err);
					connection.close();
					resolve(data);
				});
		});
	}

	getByID(id) {
		return new Promise(async (resolve, reject) => {
			if (!id) reject(new Error('missing ID parameter'));
			if (typeof id !== 'string') reject(new TypeError('expected a string'));
			const connection = await this.createConnection();
			const { tableName } = this;
			connection.use(this.dbName);
			rethink.table(tableName)
				.get(id)
				.run(connection, (err, data) => {
					if (err) reject(err);
					connection.close();
					resolve(data);
				});
		});
	}

	readDatetAndFilter(filter) {
		return new Promise(async (resolve, reject) => {
			const connection = await this.createConnection();
			const { tableName } = this;
			connection.use(this.dbName);
			rethink.table(tableName)
				.filter(filter)
				.run(connection, (err, data) => {
					if (err) reject(err);
					connection.close();
					resolve(data);
				});
		});
	}

	filterAndSort(filter, sort) {
		return new Promise(async (resolve, reject) => {
			const connection = await this.createConnection();
			const { tableName } = this;
			connection.use(this.dbName);
			rethink.table(tableName)
				.filter(filter)
				.orderBy(sort)
				.run(connection, (err, data) => {
					if (err) reject(err);
					connection.close();
					resolve(data);
				});
		});
	}

	updateData(id, data) {
		return new Promise(async (resolve, reject) => {
			const connection = await this.createConnection();
			const { tableName } = this;
			connection.use(this.dbName);
			rethink.table(tableName)
				.get(id)
				.update(data)
				.run(connection, (err, response) => {
					if (err) reject(err);
					connection.close();
					resolve(response);
				});
		});
	}

	insertData(data) {
		return new Promise(async (resolve, reject) => {
			const connection = await this.createConnection();
			const { tableName } = this;
			connection.use(this.dbName);
			rethink.table(tableName)
				.insert(data)
				.run(connection, (err, response) => {
					if (err) reject(err);
					connection.close();
					resolve(response);
				});
		});
	}

	getAndDelete(id) {
		return new Promise(async (resolve, reject) => {
			if (!id) reject(new Error('missing ID parameter'));
			if (typeof id !== 'string') reject(new TypeError('expected a string'));
			const connection = await this.createConnection();
			const { tableName } = this;
			connection.use(this.dbName);
			rethink.table(tableName)
				.get(id)
				.delete()
				.run(connection, (err, data) => {
					if (err) reject(err);
					connection.close();
					resolve(data);
				});
		});
	}

	createConnection() {
		return new Promise((resolve, reject) => {
			rethink.connect()
				.then(connection => resolve(connection))
				.catch(err => reject(err));
		});
	}

	testForTable() {
		return new Promise(async (resolve, reject) => {
			const connection = await this.createConnection();
			const { tableName } = this;
			connection.use(this.dbName);
			rethink.tableList().run(connection, (err, data) => {
				if (err) reject(err);
				connection.close();
				if (data.includes(tableName)) {
					resolve();
				} else {
					this.createTable()
						.then(() => resolve())
						.catch(error => reject(error));
				}
			});
		});
	}

	createTable() {
		return new Promise(async (resolve, reject) => {
			const connection = await this.createConnection();
			const { tableName } = this;
			connection.use(this.dbName);
			rethink.tableCreate(tableName).run(connection, err => {
				if (err) reject(err);
				connection.close();
				resolve();
			});
		});
	}

	constructor(tableName, paragon, dbName) {
		// Test if tableName is defined
		if (!tableName) throw new TypeError('Missing tableName parameter!');
		// Test of tableName is a string
		if (typeof tableName !== 'string') throw new TypeError('expected a string as Table Name');
		// Add it to this so other methods can use that
		this.tableName = tableName;
		// Test if paragon is defined
		if (!paragon) throw new TypeError('Missing paragon parameter!');
		if (typeof paragon !== 'object') throw new TypeError('expected an Object as paragon');
		// Add it to this so other methods can use that
		this.paragon = paragon;
		// Test if dbName is defined
		if (!dbName) throw new TypeError('Missing dbName parameter!');
		// Test of dbName is a string
		if (typeof dbName !== 'string') throw new TypeError('expected a string as Database Name');
		// Add it to this so other methods can use that
		this.dbName = dbName;
		// Test if this table is already there and if not create it
		this.testForTable()
			.catch(err => { throw err; });
	}
}

module.exports = TableHandler;
