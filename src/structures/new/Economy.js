class Economy {
	constructor(client) {
		this.recentlyUpdated = [];
		this.client = client;
		this.db = client.db;
	}

	static bankUpdate(model) {
		setInterval(() => this._updatebank(model), 864e5);
	}

	async messageUpdate(member) {
		if (!member) return;
		if (this.recentlyUpdated.includes(member.user.id)) return;
		this.recentlyUpdated.push(member.user.id);
		await this._addMoney(member);
		setTimeout(() => this._removeIDFromArray(member), 3e5);
	}

	async _addMoney(member) {
		let { cash, bank } = await member.getEconomy();
		cash += 5;
		await member.updateEconomy(cash, bank);
	}

	_removeIDFromArray(member) {
		this.recentlyUpdated.splice(this.recentlyUpdated.indexOf(member.id), 1);
	}

	static async _updatebank(model) {
		const values = await model.findAll();
		const promises = values.map(value => value.update({ bank: Math.floor(value.bank * 1.01) }));
		await Promise.all(promises);
	}
}

module.exports = Economy;
