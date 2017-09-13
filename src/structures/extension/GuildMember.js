const Extension = require('./Extend.js');
const permissionLevel = require('../new/Permissions.json');

class GuildMemberExtension extends Extension {
	getPermissionsLevel(client) {
		return new Promise(async (resolve, reject) => {
			if (this.id === client.config.ownerID) return resolve(permissionLevel.BOTOWNER);
			if (this.id === this.guild.owner.id) return resolve(permissionLevel.SERVEROWNER);
			const database = client.db;
			try {
				const guildConfig = await database.guild.getByID(this.guild.id);
				for (let role of this.roles) {
					if (guildConfig.moderationRolesIDs.includes(role[0])) return resolve(permissionLevel.MODERATORROLE);
				}
				for (let role of this.roles) {
					if (guildConfig.musicRolesIDs.includes(role[0])) return resolve(permissionLevel.MUSICROLE);
				}
				resolve(permissionLevel.NOTHING);
			} catch (error) {
				reject(error);
			}
		});
	}

	updateEconomy(client, cash, bank) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await client.db.money.updateData(`${this.id}${this.guild.id}`, {
					cash,
					bank
				});
				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	}

	getEconomy(client) {
		return new Promise(async (resolve, reject) => {
			try {
				const data = await client.db.money.getByID(`${this.id}${this.guild.id}`);
				if (!data) return reject(new Error('seems like you/the mentioned user did not registrate for the economy system! you can do that by using the register command'));
				resolve(data);
			} catch (error) {
				reject(error);
			}
		});
	}

	addToEconomy(client) {
		return new Promise(async (resolve, reject) => {
			try {
				const test = await client.db.money.getByID(`${this.id}${this.guild.id}`);
				if (test) return reject(new Error('already registered'));
				await client.db.money.insertData({
					id: `${this.id}${this.guild.id}`,
					guildID: this.guild.id,
					userID: this.id,
					cash: 0,
					bank: 0

				});
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	getHistory(client) {
		return new Promise(async (resolve, reject) => {
			try {
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
				resolve(history);
			} catch (error) {
				reject(error);
			}
		});
	}

	addWarn(client, reason) {
		return new Promise(async (resolve, reject) => {
			try {
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
				if (needCreate) {
					await client.db.history.insertData(history);
				} else {
					await client.db.history.updateData(`${this.id}${this.guild.id}`, { warnings });
				}
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	addKick(client, reason) {
		return new Promise(async (resolve, reject) => {
			try {
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
				if (needCreate) {
					await client.db.history.insertData(history);
				} else {
					await client.db.history.updateData(`${this.id}${this.guild.id}`, { kicks });
				}
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	addBan(client, reason) {
		return new Promise(async (resolve, reject) => {
			try {
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
				if (needCreate) {
					await client.db.history.insertData(history);
				} else {
					await client.db.history.updateData(`${this.id}${this.guild.id}`, { bans });
				}
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = GuildMemberExtension;
