module.exports = class GatewayCreator {
	constructor() {
		throw new Error('This class is abstracted and can\'t ne instanceiated');
	}

	async init(client) {
		await this.createStarboardGateaway(client);
		await this.createCasesGateaway(client);
	}

	createStarboardGateaway(client) {
		return client.gateways.register('starboard', {
			guild: { type: 'guild' },
			starCount: { type: 'integer' },
			author: { type: 'User' },
			originalMessage: { type: 'message' }
		});
	}

	createCasesGateaway(client) {
		return client.gateways.register('cases', {
			action: { type: 'string' },
			guild: { type: 'guild' },
			target: { type: 'string' },
			moderator: { type: 'member' },
			reason: {
				type: 'string',
				default: null
			},
			caseNumber: { type: 'integer' },
			message: {
				type: 'string',
				default: null
			}
		});
	}
};
