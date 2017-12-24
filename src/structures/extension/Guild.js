const Extension = require('./Extend.js');
const Music = require('../new/Music.js');
const Economy = require('../new/Economy.js');

class GuildExtension extends Extension {
	async getLeaderboard() {
		const { client, id } = this;
		let data = await client.db.economy.findAll({ where: { guild: id } });
		console.log(data)
		data = data.sort((a, b) => a.dataValues.cash + a.dataValues.bank - b.dataValues.cash + b.dataValues.bank);
		return data.map(economy => economy.dataValues);
	}

	async getStarboardMessage(originalMessageID) {
		const { client } = this;
		let result = await client.db.starboardMessages.findOne({ where: { originalMessage: originalMessageID } });
		return result;
	}

	async updateStarboardMessage({ originalMessageID, starMessageID, starCount }) {
		const { client, id } = this;
		let result = await client.db.starboardMessages.findOne({ where: { id: starMessageID, originalMessage: originalMessageID, guild: id } });
		result = await result.update({ starCount });
		return result;
	}

	async resolveStarboardMessage(originalMessageID) {
		const { client } = this;
		const result = await client.db.starboardMessages.findOne({ where: { originalMessage: originalMessageID } });
		return result;
	}

	async deleteStarboardMessage(originalMessageID) {
		const { client } = this;
		let result = await client.db.starboardMessages.findOne({ where: { originalMessage: originalMessageID } });
		result = await result.destroy();
		return result;
	}

	async getConfig() {
		const { client } = this;
		const config = await client.db.serverconfig.findOrCreate({ where: { id: this.id } });
		return config[0];
	}

	async updateConfig(data) {
		const { client, id } = this;
		const config = await client.db.serverconfig.findByID(id);
		const result = await config.update(data);
		return result;
	}

	get loop() {
		return this.music.loop;
	}

	set loop(boolean) {
		this.music.loop = boolean;
	}

	get music() {
		if (!this._music) this._music = new Music(this);
		return this._music;
	}

	get economy() {
		if (!this._economy) this._economy = new Economy(this.client);
		return this._economy;
	}
}

module.exports = GuildExtension;
