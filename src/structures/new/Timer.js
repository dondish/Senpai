module.exports = class Timer {
	constructor(client) {
		this.client = client;
		this.db = client.db;
	}

	async init() {
		const results = await this.fetchFromDB();
		const timerObjects = this.compareTimers(results);
		this.handleTimers(timerObjects);
	}

	async fetchFromDB() {
		const { db } = this;
		const result = await db.timers.findAll();
		return result;
	}

	compareTimers(array) {
		const overtime = array.filter(element => new Date().getTime() > element.date.getTime());
		const read = array.filter(element => new Date().getTime() < element.date.getTime());
		return { execute: overtime, toAdd: read };
	}

	handleTimers(object) {
		object.execute.map(this.executeTimer.bind(this));
		object.toAdd.map(this.addTimerToCache.bind(this));
	}

	addTimerToCache(timer) {
		this.client.setTimeout(() => this.executeTimer.bind(this)(timer), timer.date.getTime() - new Date().getTime());
	}

	async executeTimer(timer) {
		if (timer.type === 'reminder') this.client.channels.get(timer.channel).send(`${this.client.users.get(timer.user)} you wanted me to remind you with the Reason: ${timer.message}`);
		else if (timer.type === 'mute') this.client.channels.get(timer.channel).guild.members.get(timer.user).removeRole(this.client.channels.get(timer.channel).guild.toles.find('name', 'muted'));
		const result = await timer.destroy();
		return result;
	}
};
