const fileP = require('file');
const fs = require('fs');

class Util {
	constructor(Client) {
		this.client = Client;
	}

	static colors(type) {
		const colors = {
			Banned: 'RED',
			Ban: 'RED',
			Softbanned: 'DARK_ORANGE',
			SoftBan: 'DARK_ORANGE',
			Kicked: 'DARK_GREEN',
			Kick: 'DARK_GREEN',
			Muted: 'BLUE',
			Mute: 'Blue'
		};
		return colors[type];
	}

	async init() {
		await this._commandloader();
		await this._eventloader();
		await this._syncDatabase();
	}

	_commandloader() {
		return new Promise((resolve, reject) => {
			const { client } = this;
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

	_eventloader() {
		return new Promise((resolve, reject) => {
			const { client } = this;
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

	async _syncDatabase() {
		const { client } = this;
		await client.db.database.sync();
	}
}

module.exports = Util;
