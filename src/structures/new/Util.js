const { walk } = require('file');
const { readdir } = require('fs');
const { promisify: utilPromisify } = require('util');
const { join } = require('path');

class Util {
	constructor(Client) {
		this.client = Client;
	}

	static colors(type) {
		const colors = {
			Banned: 'RED',
			Ban: 'RED',
			Softbanned: 'DARK_ORANGE',
			Softban: 'DARK_ORANGE',
			Kicked: 'DARK_GREEN',
			Kick: 'DARK_GREEN',
			Muted: 'BLUE',
			Mute: 'Blue',
			Warn: 'NAVY',
			Warned: 'NAVY'
		};
		return colors[type];
	}

	static promisify(func) {
		return utilPromisify(func);
	}

	static walkAsync(path) {
		return new Promise((resolve, reject) => {
			walk(path, (err, ...result) => {
				if (err) return reject(err);
				resolve(result);
			});
		});
	}

	async init() {
		await this._commandloader();
		await this._eventloader();
		await this._syncDatabase();
	}

	async _commandloader() {
		const { client, constructor } = this;
		const { promisify, walkAsync } = constructor;
		const readDirAsync = promisify(readdir);
		const [path, dirs] = await walkAsync(join(__dirname, '..', '..', 'commands')); // eslint-disable-line no-unused-vars
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
				Module.aliases.forEach(alias => {
					client.aliases.set(alias, Module.name);
				});
			}
		}
	}

	async _eventloader() {
		const { client, constructor } = this;
		const { walkAsync } = constructor;
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
}

module.exports = Util;
