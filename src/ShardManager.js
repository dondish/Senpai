const { ShardingManager } = require('discord.js');
const { join } = require('path');
const { bottoken } = process.env;
const Economy = require('./structures/new/Economy.js');
const Database = require('./structures/new/Database.js');
const { economy } = new Database();
const { promisify } = require('./structures/new/Util.js');
const wait = promisify(setTimeout);
const Manager = new ShardingManager(join(__dirname, 'main.js'),
	{
		totalShards: 'auto',
		respawn: true,
		token: bottoken
	});
// Spawn shards
const spawn = async () => {
	await wait(10000);
	Manager.spawn();
};
spawn();

// Economy Bank update
Economy.bankUpdate(economy);


Manager.on('launch', shard => {
	console.log(`Shard spawned with ID ${shard.id}`);
});

// When the shard sends a message with process.send, this will get it.
Manager.on('message', (Shard, message) => {
	console.log('[TO MANAGER]:', require('util').inspect(message));
	if (!message.b) { Shard.send('Welcome! -manager'); } else {
		Shard.send({
			obj: 'hi all',
			b: message.b
		});
	}
});
