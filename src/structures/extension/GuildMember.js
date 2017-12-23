const Extension = require('./Extend.js');
const { BOTOWNER, SERVEROWNER, MODERATORROLE, MUSICROLE, NOTHING } = require('../new/Permissions.json');

class GuildMemberExtension extends Extension {
	async isBlacklisted() {
		const { client } = this;
		const result = await client.db.blacklist.findOrCreate({ where: { id: this.id } });
		if (result[0].global || result[0].guilds.includes(this.guild.id)) return true;
		return false;
	}

	async getPermissionsLevel() {
		const { client, guild, id, roles } = this;
		if (id === client.config.ownerID) return BOTOWNER;
		if (id === guild.owner.id) return SERVEROWNER;
		const database = client.db;
		const guildConfig = await database.guildsettings.findById(guild.id);
		for (let role of roles) {
			if (guildConfig.modRoles.includes(role[0])) return MODERATORROLE;
		}
		for (let role of roles) {
			if (guildConfig.modRoles.includes(role[0])) return MUSICROLE;
		}
		return NOTHING;
	}

	async updateEconomy(cash, bank) {
		const { client, id, guild } = this;
		const data = await client.db.economy.findOne({ where: { user: id, guild: guild.id } });
		const result = await data.update({
			cash,
			bank
		});
		return result;
	}

	async getEconomy() {
		const { client, id, guild } = this;
		const [data] = await client.db.economy.findOrCreate({ where: { user: id, guild: guild.id } });
		return data;
	}

	async getHistory() {
		const { client, id, guild } = this;
		const [history] = await client.db.history.findOrCreate({ where: { user: id, guild: guild.id } });
		return history;
	}

	async editHistory(type) {
		const { client, id, guild } = this;
		let [history] = await client.db.history.findOrCreate({ where: { user: id, guild: guild.id } });
		history[type]++;
		await history.save();
		return history;
	}
}

module.exports = GuildMemberExtension;
