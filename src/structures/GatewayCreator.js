module.exports = class GatewayCreator {
	constructor(client) {
		this.client = client;
		this.createCasesGateaway();
		this.createStarboardGateaway();
	}

	createStarboardGateaway() {
		this.client.gateways.register('starboard', {
			guild: { type: 'guild' },
			starCount: { type: 'integer' },
			author: { type: 'User' },
			originalMessage: { type: 'message' }
		});
	}

	createCasesGateaway() {
		this.client.gateways.register('cases', {
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
