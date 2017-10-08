const rethink = require('rethinkdb');

class Economy {
	constructor(client) {
		this.recentlyUpdated = [];
		this.client = client;
		this.db = client.db;
	}

	static bankUpdate() {
		setInterval(() => this._updatebank(), 18000000);
	}

	messageUpdate(member) {
		if (!member) return;
		if (this.recentlyUpdated.includes(member.user.id)) return;
		this.recentlyUpdated.push(member.user.id);
		try {
			setTimeout(() => this._addMoney(member), 5000);
			setTimeout(() => this._removeIDFromArray(member), 30000);
		} catch (error) {
			return; // eslint-disable-line no-useless-return
		}
	}

	async _addMoney(member) {
		let { cash, bank } = await member.getEconomy(this.client);
		cash += 5;
		await member.updateEconomy(this.client, cash, bank);
	}

	_removeIDFromArray(member) {
		this.recentlyUpdated.splice(this.recentlyUpdated.indexOf(member.id), 1);
	}

	static async _updatebank() {
		const connection = await this.createConnection();
		const { tableName } = this;
		connection.use(this.dbName);
		rethink.table(tableName)
			.update({ bank: rethink.round(rethink.row('bank').mul(1.01)) })
			.run(connection, (err, response) => {
				if (err) throw err;
				connection.close();
				return response;
			});
	}
}

module.exports = Economy;
