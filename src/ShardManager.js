const { ShardingManager } = require('discord.js');
const { join } = require('path');
const { promisify } = require('util');
const { bottoken } = process.env;
const wait = promisify(setTimeout);
const Manager = new ShardingManager(join(__dirname, 'main.js'),
	{
		totalShards: 'auto',
		respawn: true,
		token: bottoken
	});
// Spawn shards
const spawn = async () => {
	await wait(5000);
	Manager.spawn();
};
spawn();

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
