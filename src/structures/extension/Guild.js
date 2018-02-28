const Extension = require('./Extend.js');
const Music = require('../new/Music.js');
const Economy = require('../new/Economy.js');
const { RichEmbed } = require('discord.js');
const { colors } = require('../new/Util');

class GuildExtension extends Extension {
	async getLeaderboard() {
		const { client, id } = this;
		let data = await client.db.economy.findAll({ where: { guild: id } });
		data = data.map(economy => economy.dataValues);
		data = data.sort((a, b) => (a.cash + a.bank) - (b.cash + b.bank));
		return data.reverse();
	}

	async getStarboardMessage(originalMessageID) {
		const { client } = this;
		let result = await client.db.starboardMessages.findOne({ where: { originalMessage: originalMessageID } });
		return result ? result.dataValues : result;
	}

	async createStarboardMessage({ originalMessageID, starMessageID, starCount, author }) {
		const { client, id } = this;
		let result = await client.db.starboardMessages.create({ id: starMessageID, originalMessage: originalMessageID, guild: id, starCount, author });
		return result.dataValues;
	}

	async updateStarboardMessage({ originalMessageID, starMessageID, starCount }) {
		const { client, id } = this;
		let result = await client.db.starboardMessages.findOne({ where: { id: starMessageID, originalMessage: originalMessageID, guild: id } });
		result = await result.update({ starCount });
		return result.dataValues;
	}

	async deleteStarboardMessage(originalMessageID) {
		const { client } = this;
		let result = await client.db.starboardMessages.findOne({ where: { originalMessage: originalMessageID } });
		result = await result.destroy();
		return result.dataValues;
	}

	async getConfig() {
		const { client } = this;
		const [config] = await client.db.serverconfig.findOrCreate({ where: { id: this.id } });
		return config.dataValues;
	}

	async updateConfig(data) {
		const { client, id } = this;
		const config = await client.db.serverconfig.findById(id);
		const result = await config.update(data);
		return result.dataValues;
	}

	async latestCase() {
		const { client, id } = this;
		let result = await client.db.cases.findAll({ where: { guild: id }, attributes: ['caseNumber'] });
		result = result.map(res => res.dataValues);
		result = result.sort((a, b) => b.caseNumber - a.caseNumber);
		return result[0];
	}

	async updateCase({ reason, caseNumber, channel }) {
		const { client, id } = this;
		const caseObject = await client.db.cases.findOne({ where: { guild: id, caseNumber } });
		if (!caseObject) throw new Error('Case not Found');
		const result = await caseObject.update({ reason });
		const message = await channel.fetchMessage(caseObject.message);
		const values = result.dataValues;
		const user = await client.fetchUser(values.target);
		const moderator = await client.fetchUser(values.moderator);
		const embed = new RichEmbed()
			.setAuthor(moderator.tag, moderator.displayAvatarURL)
			.setColor(colors(values.action))
			.setTimestamp()
			.addField('Action', values.action)
			.addField('Target', `${user.tag} (${user.id})`)
			.addField('Reason', reason)
			.setFooter(`Case ${caseNumber}`)
			.setTimestamp();
		await message.edit(embed);
		return result.dataValues;
	}

	get music() {
		if (!this._music) this._music = new Music(this.client, this.id);
		return this._music;
	}

	get economy() {
		if (!this._economy) this._economy = new Economy(this.client);
		return this._economy;
	}
}

module.exports = GuildExtension;
