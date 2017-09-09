const file = require('file')
const fs = require('fs')

module.exports = Client => {
    file.walk('./commands', (err, dirPath, dirs) => {
        if (err) throw err;
        dirs.forEach(dir => {
            fs.readdir(`${dir}`, (err, files) => {
                if (err) throw err
                const folder = dir.slice(9)
                files.forEach(file => {
                    let Command = require(`../commands/${folder}/${file}`);
                    let Module = new Command(Client, folder)
                    Client.commands.set(Module.name, Module);
                    Client.log.debug(`Loading Command: ${Module.name} from ${folder}.`)
                    Module.aliases.forEach(alias => {
                        Client.aliases.set(alias, Module.name);
                    });
                });
            });
        });
    });
}
