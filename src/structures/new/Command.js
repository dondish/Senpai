class Commands {
	constructor(client, info, group) {
		// Validate everything needed is there and right type
		this.constructor.validateInfo(client, info, group);
		// Add the client to this
		this.client = client;
		// Add the info stuff to this
		this.name = info.name;
		this.description = info.description;
		this.aliases = info.aliases;
		this.examples = info.examples;
		this.group = group;
	}

	static validateInfo(client, info, group) {
		if (!client) throw new Error('A client must be specified.');
		if (typeof info !== 'object') throw new TypeError('Command info must be an Object.');
		if (typeof info.name !== 'string') throw new TypeError('Command name must be a string.');
		if (info.name !== info.name.toLowerCase()) throw new Error('Command name must be lowercase.');
		if (typeof info.description !== 'string') throw new TypeError('Command description must be a string.');
		if (info.aliases && (!Array.isArray(info.aliases) || info.aliases.some(ali => typeof ali !== 'string'))) {
			throw new TypeError('Command aliases must be an Array of strings.');
		}
		if (info.aliases && info.aliases.some(ali => ali !== ali.toLowerCase())) {
			throw new Error('Command aliases must be lowercase.');
		}
		if (!info.examples) throw new Error('Command examples must be specified.');
		if (info.examples && (!Array.isArray(info.examples) || info.examples.some(ali => typeof ali !== 'string'))) {
			throw new TypeError('Command examples must be an Array of strings.');
		}
		if (typeof group !== 'string') throw new TypeError('group name must be a string.');
	}
}

module.exports = Commands;
