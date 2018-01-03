const { walk } = require('file');
const { readdir } = require('fs');
const { promisify: utilPromisify } = require('util');

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

	walkAsync(path) {
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
		const { client, walkAsync, constructor } = this;
		const { promisify } = constructor;
		const readDirAsync = promisify(readdir);
		const [path, dirs] = await walkAsync('../src/commands'); // eslint-disable-line no-unused-vars
		const promises = [];
		for (const dir of dirs) {
			promises.push(new Promise((resolve, reject) => {
				readDirAsync(dir).then(result => resolve([result, dir])).catch(reject);
			}));
		}
		const results = await Promise.all(promises);
		for (const result of results) {
			let [commands, folder] = result;
			folder = folder.slice(16);
			for (const command of commands) {
				let Command = require(`../../commands/${folder}/${command}`);
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
		const { client, walkAsync } = this;
		const [dirPath, dirs, files] = await walkAsync('./events'); // eslint-disable-line no-unused-vars
		files.forEach(element => {
			const name = element.slice(7);
			const EventClass = require(`../../events/${name}`);
			const Event = new EventClass(client);
			client.on(Event.name, Event.run.bind(Event));
		});
	}

	async _syncDatabase() {
		const { client } = this;
		await client.db.database.sync();
	}
}

module.exports = Util;
