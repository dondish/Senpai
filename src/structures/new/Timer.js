module.exports = class Timer {
	constructor(client) {
		this.client = client;
		this.db = client.db;
	}

	async init() {
		let result = await this.fetchFromDB();
		result = this.compareTimers(result);
		this.handleTimers(result);
	}

	async fetchFromDB() {
		const { db } = this;
		const result = await db.timers.findAll();
		return result;
	}

	compareTimers(array) {
		const overtime = array.filter(element => Date.now() > element.date.getTime());
		const readd = array.filter(element => Date.now() < element.date.getTime());
		return { execute: overtime, toAdd: readd };
	}

	handleTimers(object) {
		object.execute.map(this.executeTimer);
		object.toAdd.map(this.addTimerToCache);
	}

	addTimerToCache(timer) {
		if (timer.type === 'reminder') this.client.setTimeout(() => this.client.channels.get(timer.channel).send(`${this.client.users.get(timer.user)} you wanted me to remind you with the Reason: ${timer.message}`), Date.now() - timer.date.getTime());
		else if (timer.type === 'mute') this.client.setTimeout(() => this.client.channels.get(timer.channel).guild.members.get(timer.user).removeRole(this.client.channels.get(timer.channel).guild.roles.find('name', 'muted')), Date.now() - timer.date.getTime());
	}

	async executeTimer(timer) {
		if (timer.type === 'reminder') this.client.channels.get(timer.channel).send(`${this.client.users.get(timer.user)} you wanted me to remind you with the Reason: ${timer.message}`);
		else if (timer.type === 'mute') this.client.channels.get(timer.channel).guild.members.get(timer.user).removeRole(this.client.channels.get(timer.channel).guild.toles.find('name', 'muted'));
		const result = await timer.delete();
		return result;
	}
};
