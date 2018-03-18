const { join } = require('path');
const Client = require(join(__dirname, 'structures', 'Client.js'));
const permissionsLevels = require(join(__dirname, 'structures', 'PermissionLevel.js'));
//const GatewayCreator = require(join(__dirname, 'structures', 'GatewayCreator.js'));
const { prefix } = process.env;

const client = new Client({
	messageCacheMaxSize: 50,
	messageSweepInterval: 60,
	prefix,
	cmdEditing: true,
	cmdLogging: true,
	cmdDeleting: true,
	cmdPrompt: true,
	ignoreSelf: true,
	ignoreBots: true,
	permissionsLevels,
	//providers: { default: 'PostgreSQL' },
	promptTime: 20000,
	readyMessage: readyClient => [
		'-----------------------------------------------------------------------------',
		`Shard ID:              ${readyClient.shard.id}`,
		`Server Count:          ${readyClient.guilds.size}`,
		`Channel Count:         ${readyClient.channels.size}`,
		`User Count:            ${readyClient.users.size}`,
		'-----------------------------------------------------------------------------'
	]
});

client.login(client.tokens.bottoken);

//const creator = new GatewayCreator(client);
