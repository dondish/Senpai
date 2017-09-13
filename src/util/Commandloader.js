const fileP = require('file');
const fs = require('fs');

module.exports = Client => {
	fileP.walk('./commands', (error, dirPath, dirs) => {
		if (error) throw error;
		dirs.forEach(dir => {
			fs.readdir(`${dir}`, (err, files) => {
				if (err) throw err;
				const folder = dir.slice(9);
				files.forEach(file => {
					let Command = require(`../commands/${folder}/${file}`);
					let Module = new Command(Client, folder);
					Client.commands.set(Module.name, Module);
					Client.log.debug(`Loading Command: ${Module.name} from ${folder}.`);
					Module.aliases.forEach(alias => { // eslint-disable-line max-nested-callbacks                        
						Client.aliases.set(alias, Module.name);
					});
				});
			});
		});
	});
};
