const Extension = require('./Extend.js');
const { BOTOWNER, SERVEROWNER, ADMINISTRATOR, MODERATORROLE, MUSICROLE, NOTHING } = require('../new/Permissions.json');
const { RichEmbed } = require('discord.js');
const { colors } = require('../new/Util');

class GuildMemberExtension extends Extension {
	async isBlacklisted() {
		const { client } = this;
		const result = await client.db.blacklist.findOrCreate({ where: { id: this.id } });
		if (result[0].global || result[0].guilds.includes(this.guild.id)) return true;
		return false;
	}

	async getPermissionsLevel() {
		const { client, guild, id, roles } = this;
		if (id === client.constants.ownerID) return BOTOWNER;
		if (id === guild.owner.id) return SERVEROWNER;
		if (this.permissions.has('ADMINISTRATOR')) return ADMINISTRATOR;
		const guildConfig = await client.db.serverconfig.findById(guild.id);
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
		return result.dataValues;
	}

	async getEconomy() {
		const { client, id, guild } = this;
		const [data] = await client.db.economy.findOrCreate({ where: { user: id, guild: guild.id } });
		return data.dataValues;
	}

	async getHistory() {
		const { client, id, guild } = this;
		const [history] = await client.db.history.findOrCreate({ where: { user: id, guild: guild.id } });
		return history.dataValues;
	}

	async editHistory(type) {
		const { client, id, guild } = this;
		let action = type === 'Softban' ? 'kick' : type.toLowerCase();
		let [history] = await client.db.history.findOrCreate({ where: { user: id, guild: guild.id } });
		history[`${action}Count`]++;
		await history.save();
		return history.dataValues;
	}

	async createCase({ moderator, reason, channel, action }) {
		const { client, id, user, guild } = this;
		let result = await client.db.cases.findAll({ where: { guild: guild.id }, attributes: ['caseNumber'] });
		result = result.map(res => res.dataValues);
		result = result.sort((a, b) => b.caseNumber - a.caseNumber);
		let caseNumber;
		if (result[0]) caseNumber = result[0].caseNumber;
		else caseNumber = 0;
		caseNumber++;
		const embed = new RichEmbed()
			.setAuthor(moderator.tag, moderator.displayAvatarURL)
			.setColor(colors(action))
			.setTimestamp()
			.addField('Action', action)
			.addField('Target', `${user.tag} (${id})`)
			.addField('Reason', reason)
			.setFooter(`Case ${caseNumber}`)
			.setTimestamp();
		let message = { id: null };
		if (channel) message = await channel.send(embed);
		await client.db.cases.create({ guild: guild.id, message: message.id, caseNumber, target: id, action, reason, moderator: moderator.id });
		await this.editHistory(action);
	}
}

module.exports = GuildMemberExtension;
