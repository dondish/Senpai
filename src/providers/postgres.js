const { SQLProvider, QueryBuilder, util } = require('klasa');
const { Pool } = require('pg');

/**
 * Class to interact with the Postgresql Database
 */
module.exports = class PostgresProvider extends SQLProvider {
	/**
	 * Creates a new instance of this PostgresProvider Class
	 * @param {any[]} args Arguments for the Providerclasss
	 */
	constructor(...args) {
		super(...args, {
			name: 'Postgres',
			description: 'Allows you to use PostgreSQL functionality throught Klasa'
		});
		this.db = null;
		this.qb = new QueryBuilder(this.client, {
			BOOLEAN: { name: 'BOOL', default: ['false', 'true'], size: false },
			FLOAT: { name: 'BIGINT', default: '0', size: false },
			INTEGER: { name: 'INTEGER', default: '0', size: false },
			REAL: { name: 'BIGINT', default: '0', size: false },
			TEXT: { name: 'TEXT', default: '', size: false },
			VARCHAR: { name: 'VARCHAR', default: '', size: true }
		}, { arrayWrap: type => `${type}[]` });
	}

	/**
	 * Method to initialize this Provider
	 * @returns {Promise<*>}
	 */
	init() {
		const connection = util.mergeDefault({
			host: 'localhost',
			port: 5432,
			db: 'postgres',
			user: 'postgres',
			password: 'password',
			options: {
				max: 20,
				idleTimeoutMillis: 30000,
				connectionTimeoutMillis: 2000
			}
		}, this.client.options.providers.postgresql);
		this.db = new Pool(Object.assign({
			host: connection.host,
			port: connection.port,
			user: connection.user,
			password: connection.password,
			database: connection.db
		}, connection.options));

		this.db.on('error', err => this.client.emit('error', err));
		return this.db.connect();
	}
	/**
	 * Method to shutdown this Provider
	 * @returns {Promise<void>}
	 */
	shutdown() {
		return this.db.end();
	}

	/** Table Methods */

	/**
	 * Checks if a table exists.
	 * @param {string} table The name of the table you want to check
	 * @returns {Promise<boolean>}
	 */
	hasTable(table) {
		return this._runAll(`SELECT true FROM pg_tables WHERE tablename = '${table}';`)
			.then(result => result.length && result[0].bool === true)
			.catch(() => false);
	}

	/**
	 * Creates a new Table.
	 * @param {string} table The name for the new directory
	 * @param {Object} data The data to columes and there types to create with
	 * @returns {Promise<void>}
	 */
	createTable(table, data) {
		return this._run(`CREATE TABLE ${sanitizeKeyName(table)} (${data.map(([k, v]) => `"${k}" ${v}`).join(', ')});`);
	}

	/**
	 * Deletes a Table.
	 * @param {string} table The directory's name to delete
	 * @returns {Promise<void>}
	 */
	deleteTable(table) {
		return this._run(`DROP TABLE IF EXISTS ${sanitizeKeyName(table)};`);
	}

	/** Row Methods */

	/**
	 * Get all rows from a table.
	 * @param {string} table The name of the directory to fetch from
	 * @returns {Promise<Object[]>}
	 */
	getAll(table) {
		return this._runAll(`SELECT * FROM ${sanitizeKeyName(table)};`);
	}

	/**
	 * Get all row ids from a table.
	 * @param {string} table The name of the table to fetch from
	 * @returns {Promise<string[]>}
	 */
	getKeys(table) {
		return this._runAll(`SELECT id FROM ${sanitizeKeyName(table)};`)
			.then(rows => rows.map(row => row.id));
	}

	/**
	 * Gets a value from a table by key, filtered by given value
	 * @param {string} table The name of the table to get the data from
	 * @param {string} key The key to filter the data from
	 * @param {*}    [value] The value of the filtered key
	 * @returns {Promise<Object>}
	 */
	get(table, key, value) {
		// If a key is given (id), swap it and search by id - value
		if (typeof value === 'undefined') {
			value = key;
			key = 'id';
		}
		return this._runOne(`SELECT * FROM ${sanitizeKeyName(table)} WHERE ${sanitizeKeyName(key)} = $1 LIMIT 1;`, [value]);
	}

	/**
	 * Returns a Boolean indicating if a row is present
	 * @param {string} table The name of the table to get the data from
	 * @param {string} id    The id of the row
	 * @returns {Promise<boolean>}
	 */
	has(table, id) {
		return this._runOne(`SELECT id FROM ${sanitizeKeyName(table)} WHERE id = $1 LIMIT 1;`, [id])
			.then(result => Boolean(result));
	}

	/**
	 * Gets a random row from a table
	 * @param {string} table The name of the table to get the data from
	 * @returns {Promise<Object>}
	 */
	getRandom(table) {
		return this._runOne(`SELECT * FROM ${sanitizeKeyName(table)} ORDER BY RANDOM() LIMIT 1;`);
	}

	/**
	 * Update or insert a new value to all entries.
	 * @param {string} table The name of the table
	 * @param {string} colum The colum to update
	 * @param {*} newValue The new value for the key
	 * @returns {Promise<Object>}
	 */
	updateValue(table, colum, newValue) {
		return this._run(`UPDATE ${sanitizeKeyName(table)} SET ${sanitizeKeyName(colum)} = $1`, [newValue]);
	}

	/**
	 * Remove a value or object from all entries.
	 * @param {string} table The name of the directory
	 * @param {string} colum The key's path to updaterow
	 * @returns {Promise<Object>}
	 */
	removeValue(table, colum) {
		return this._run(`UPDATE ${sanitizeKeyName(table)} SET ${sanitizeKeyName(colum)} = DEFAULT`);
	}

	/**
	 * Insert a new row on a table.
	 * @param {string} table The name of the table
	 * @param {string} id The row id
	 * @param {Object} data The object with all properties you want to insert into the table
	 * @returns {Promise<Object>}
	 */
	create(table, id, data) {
		const parsedData = this.parseInput(data);
		const keys = [];
		const values = [];
		for (const [key, value] of parsedData) {
			keys.push(key);
			values.push(value);
		}
		return this._run(`INSERT INTO ${sanitizeKeyName(table)} (${keys.map(sanitizeKeyName).join(', ')}) VALUES (${makeVariables(keys.length)});`, values);
	}

	set(...args) {
		return this.create(...args);
	}

	insert(...args) {
		return this.create(...args);
	}

	/**
	 * Update a row from a table
	 * @param {string} table The name of the directory
	 * @param {string} id The id of this row
	 * @param {Object} data The object with all the properties you want to update
	 * @returns {Promise<Object>}
	 */
	update(table, id, data) {
		const parsedData = this.parseInput(data);
		const keys = [];
		const values = [];
		for (const [key, value] of parsedData) {
			keys.push(key);
			values.push(value);
		}
		const playceholders = makeVariables(keys.length);
		let keyPlaceholderstring = '';
		for (let index = 0; index < keys.length; index++) {
			keyPlaceholderstring += `${sanitizeKeyName(keys[index])} = ${playceholders[index]}, `;
		}
		return this._run(`UPDATE ${sanitizeKeyName(table)} SET ${keyPlaceholderstring} WHERE id = ${sanitizeKeyName(id)}`, values);
	}

	/**
	 * Add a new column to a table's schema.
	 * @param {string} table The name of the table to edit.
	 * @param {(string|Array<string[]>)} key The key to add.
	 * @param {string} [datatype] The datatype for the new key.
	 * @returns {Promise<any[]>}
	 */
	addColumn(table, key, datatype) {
		if (typeof key === 'string') return this.run(`ALTER TABLE ${sanitizeKeyName(table)} ADD COLUMN ${sanitizeKeyName(key)} ${datatype};`);
		if (typeof datatype === 'undefined' && Array.isArray(key)) {
			return this.run(`ALTER TABLE ${sanitizeKeyName(table)} ${key.map(([column, type]) =>
				`ADD COLUMN ${sanitizeKeyName(column)} ${type}`).join(', ')};`);
		}
		throw new TypeError('Invalid usage of PostgreSQL#addColumn. Expected a string and string or string[][] and undefined.');
	}

	/**
	 * Remove a column from a table's schema.
	 * @param {string} table The name of the table to edit.
	 * @param {(string|string[])} key The key to remove.
	 * @returns {Promise<any[]>}
	 */
	removeColumn(table, key) {
		if (typeof key === 'string') return this.run(`ALTER TABLE ${sanitizeKeyName(table)} DROP COLUMN ${sanitizeKeyName(key)};`);
		if (Array.isArray(key)) return this.run(`ALTER TABLE ${sanitizeKeyName(table)} DROP ${key.map(sanitizeKeyName).join(', ')};`);
		throw new TypeError('Invalid usage of PostgreSQL#removeColumn. Expected a string or string[].');
	}

	/**
	 * Edit the key's datatype from the table's schema.
	 * @param {string} table The name of the table to edit.
	 * @param {string} key The name of the column to update.
	 * @param {string} datatype The new datatype for the column.
	 * @returns {Promise<any[]>}
	 */
	updateColumn(table, key, datatype) {
		return this.run(`ALTER TABLE ${sanitizeKeyName(table)} ALTER ${sanitizeKeyName(key)} TYPE ${datatype};`);
	}

	/**
	 * @param {...*} args The arguments
	 * @alias PostgreSQL#update
	 * @returns {Promise<any[]>}
	 */
	replace(...args) {
		return this.update(...args);
	}

	/**
	 * Delete a row from the table.
	 * @param {string} table The name of the directory
	 * @param {string} id The row id
	 * @returns {Promise<void>}
	 */
	delete(table, id) {
		return this._run(`DELETE FROM ${sanitizeKeyName(table)} WHERE "id" = ${id};`);
	}
	/**
	 * Run a Query on the database
	 * @param {...*} query the query to execute
	 * @returns {Promise<*>}
	 */
	_run(...query) {
		return this.db.query(...query);
	}

	/**
	 * Run a query and get all entries from a table.
	 * @param {...any} sql The query to execute.
	 * @returns {Promise<any[]>}
	 */
	_runAll(...sql) {
		return this._run(...sql)
			.then(result => result.rows);
	}

	/**
	 * Run a query and get one row from a table.
	 * @param {...any} sql The query to execute.
	 * @returns {Promise<Object>}
	 */
	_runOne(...sql) {
		return this._run(...sql)
			.then(result => result.rows[0]);
	}
};

/**
 * A helper function to sanitize key names in postgresql
 * @param {string} value The string to sanitize as a key
 * @returns {string}
 * @private
 */
function sanitizeKeyName(value) {
	if (typeof value !== 'string') {
		throw new TypeError(`%PostgreSQL.sanitizeString expects a string, got: ${typeof value}`);
	}
	if (/`|"/.test(value)) {
		throw new TypeError(`Invalid input (${value}).`);
	}
	if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
		return value;
	}
	return `"${value}"`;
}
/**
 * A helper function to generate an array of placeholders
 * @param {nmumber} number the length of this array
 * @private
 * @returns {Array<string>}
 */
function makeVariables(number) {
	return new Array(number).fill().map((__, index) => `$${index + 1}`)
		.join(', ');
}
