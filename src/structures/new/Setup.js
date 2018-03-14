const { join } = require('path');
const { walkAsync, promisify } = require('./Util');
const { readdir } = require('fs');

module.exports = class Setup {
	constructor(client) {
		this.client = client;
	}
	async init() {
		const loaded = await this._dirloader();
		await this._commandloader(loaded);
		await this._eventloader();
		await this._syncDatabase();
	}

	async _dirloader() {
		const { client } = this;
		const [path, dirs] = await walkAsync(join(__dirname, '..', '..', 'commands'));
		client.categories = dirs;
		return { path, dirs };
	}

	async _commandloader({ path, dirs }) {
		const { client } = this;
		const readDirAsync = promisify(readdir);
		const promises = [];
		for (const dir of dirs) {
			promises.push(new Promise((resolve, reject) => {
				readDirAsync(dir).then(result => resolve([result, dir])).catch(reject);
			}));
		}
		const results = await Promise.all(promises);
		for (const result of results) {
			let [commands, folder] = result;
			folder = folder.slice(path.length);
			for (const command of commands) {
				let Command = require(join(__dirname, '..', '..', 'commands', folder, command));
				let Module = new Command(client, folder);
				client.commands.set(Module.name, Module);
				client.log.debug(`Loading Command: ${Module.name} from ${folder}.`);
				if (Module.aliases) Module.aliases.forEach(alias => client.aliases.set(alias, Module.name));
			}
		}
	}

	async _eventloader() {
		const { client } = this;
		const [dirPath, dirs, files] = await walkAsync(join(__dirname, '..', '..', 'events')); // eslint-disable-line no-unused-vars
		files.forEach(element => {
			const name = element.slice(dirPath.length);
			const EventClass = require(join(__dirname, '..', '..', 'events', name));
			const Event = new EventClass(client);
			const eventWrap = async (...args) => {
				try {
					await Event.run(...args);
				} catch (error) {
					this.client.log.error(`${Event.name} encountered following error ${error.stack}`);
				}
			};
			client.on(Event.name, eventWrap);
		});
	}


	async _syncDatabase() {
		const { client } = this;
		await client.db.database.sync();
	}
};
