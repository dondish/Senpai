const Extension = require('./Extend.js');
const permissionLevel = require('../new/Permissions.json');

class GuildMemberExtension extends Extension {
	async getPermissionsLevel() {
		const { client } = this;
		if (this.id === client.config.ownerID) return permissionLevel.BOTOWNER;
		if (this.id === this.guild.owner.id) return permissionLevel.SERVEROWNER;
		const database = client.db;
		const guildConfig = await database.guild.getByID(this.guild.id);
		for (let role of this.roles) {
			if (guildConfig.moderationRolesIDs.includes(role[0])) return permissionLevel.MODERATORROLE;
		}
		for (let role of this.roles) {
			if (guildConfig.musicRolesIDs.includes(role[0])) return permissionLevel.MUSICROLE;
		}
		return permissionLevel.NOTHING;
	}

	async updateEconomy(cash, bank) {
		const { client } = this;
		const result = await client.db.money.updateData(`${this.id}${this.guild.id}`, {
			cash,
			bank
		});
		return result;
	}

	async getEconomy() {
		const { client } = this;
		const data = await client.db.money.getByID(`${this.id}${this.guild.id}`);
		if (!data) throw new Error('seems like you/the mentioned user did not registrate for the economy system! you can do that by using the register command');
		return data;
	}

	async addToEconomy() {
		const { client } = this;
		const test = await client.db.money.getByID(`${this.id}${this.guild.id}`);
		if (test) throw new Error('already registered');
		const result = await client.db.money.insertData({
			id: `${this.id}${this.guild.id}`,
			guildID: this.guild.id,
			userID: this.id,
			cash: 0,
			bank: 0
		});
		return result;
	}

	async getHistory() {
		const { client } = this;
		let history = await client.db.history.getByID(`${this.id}${this.guild.id}`);
		if (!history) {
			history = {
				id: `${this.id}${this.guild.id}`,
				guildID: this.guild.id,
				userID: this.id,
				warnings: [],
				kicks: [],
				bans: []
			}
			;
		}
		return history;
	}

	async addWarn(reason) {
		const { client } = this;
		let needCreate = false;
		let history = await client.db.history.getByID(`${this.id}${this.guild.id}`);
		if (!history) {
			needCreate = true;
			history = {
				id: `${this.id}${this.guild.id}`,
				guildID: this.guild.id,
				userID: this.id,
				warnings: [],
				kicks: [],
				bans: []
			};
		}
		const { warnings } = history;
		warnings.push(reason);
		let result;
		if (needCreate) {
			result = await client.db.history.insertData(history);
		} else {
			result = await client.db.history.updateData(`${this.id}${this.guild.id}`, { warnings });
		}
		return result;
	}

	async addKick(reason) {
		const { client } = this;
		let needCreate = false;
		let history = await client.db.history.getByID(`${this.id}${this.guild.id}`);
		if (!history) {
			needCreate = true;
			history = {
				id: `${this.id}${this.guild.id}`,
				guildID: this.guild.id,
				userID: this.id,
				warnings: [],
				kicks: [],
				bans: []
			};
		}
		const { kicks } = history;
		kicks.push(reason);
		let result;
		if (needCreate) {
			result = await client.db.history.insertData(history);
		} else {
			result = await client.db.history.updateData(`${this.id}${this.guild.id}`, { kicks });
		}
		return result;
	}

	async addBan(reason) {
		const { client } = this;
		let needCreate = false;
		let history = await client.db.history.getByID(`${this.id}${this.guild.id}`);
		if (!history) {
			needCreate = true;
			history = {
				id: `${this.id}${this.guild.id}`,
				guildID: this.guild.id,
				userID: this.id,
				warnings: [],
				kicks: [],
				bans: []
			};
		}
		const { bans } = history;
		bans.push(reason);
		let result;
		if (needCreate) {
			result = await client.db.history.insertData(history);
		} else {
			result = await client.db.history.updateData(`${this.id}${this.guild.id}`, { bans });
		}
		return result;
	}
}

module.exports = GuildMemberExtension;
