const fileP = require('file');
const fs = require('fs');

class Util {
	constructor(Client) {
		this.client = Client;
	}

	async init() {
		const { client } = this;
		await this._commandloader(client);
		await this._eventloader(client);
	}

	_commandloader(client) {
		return new Promise((resolve, reject) => {
			fileP.walk('./commands', (error, dirPath, dirs) => {
				if (error) reject(error);
				dirs.forEach(dir => {
					fs.readdir(dir, (err, files) => {
						if (err) reject(err);
						const folder = dir.slice(9);
						files.forEach(file => {
							let Command = require(`../../commands/${folder}/${file}`);
							let Module = new Command(client, folder);
							client.commands.set(Module.name, Module);
							client.log.debug(`Loading Command: ${Module.name} from ${folder}.`);
							Module.aliases.forEach(alias => { // eslint-disable-line max-nested-callbacks
								client.aliases.set(alias, Module.name);
							});
						});
					});
				});
				resolve();
			});
		});
	}

	_eventloader(client) {
		return new Promise((resolve, reject) => {
			fileP.walk('./events', (err, dirPath, dirs, files) => {
				if (err) reject(err);
				files.forEach(element => {
					const name = element.slice(7);
					const EventClass = require(`../../events/${name}`);
					const Event = new EventClass(client);
					client.on(Event.name, Event.run.bind(Event));
				});
				resolve();
			});
		});
	}
}

module.exports = Util;
