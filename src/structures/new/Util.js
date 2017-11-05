const fileP = require('file');
const fs = require('fs');

class Util {
	async init(Client) {
		await this._commandloader(Client);
		await this._eventloader(Client);
	}

	_commandloader(Client) {
		return new Promise((resolve, reject) => {
			fileP.walk('./commands', (error, dirPath, dirs) => {
				if (error) reject(error);
				dirs.forEach(dir => {
					fs.readdir(`${dir}`, (err, files) => {
						if (err) reject(err);
						const folder = dir.slice(9);
						files.forEach(file => {
							let Command = require(`../../commands/${folder}/${file}`);
							let Module = new Command(Client, folder);
							Client.commands.set(Module.name, Module);
							Client.log.debug(`Loading Command: ${Module.name} from ${folder}.`);
							Module.aliases.forEach(alias => { // eslint-disable-line max-nested-callbacks
								Client.aliases.set(alias, Module.name);
							});
						});
					});
				});
				resolve();
			});
		});
	}

	_eventloader(Client) {
		return new Promise((resolve, reject) => {
			fileP.walk('./events', (err, dirPath, dirs, files) => {
				if (err) reject(err);
				files.forEach(element => {
					const name = element.slice(7);
					const EventClass = require(`../../events/${name}`);
					const Event = new EventClass(Client);
					Client.on(Event.name, (par1, par2, par3) => Event.run(par1, par2, par3));
				});
				resolve();
			});
		});
	}
}

module.exports = Util;
