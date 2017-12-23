const Extension = require('./Extend.js');
const Music = require('../new/Music.js');
const Economy = require('../new/Economy.js');

class GuildExtension extends Extension {
	async getLeaderboard() {
		const { client, id } = this;
		let data = await client.db.economy.findAll({ where: { guild: id } });
		data = data.sort((a, b) => a.cash + a.bank - b.cash + b.bank);
		return data;
	}

	async getStarboardMessages() {
		const { client } = this;
		let result = await client.db.starboardMessages.getByID(this.id);
		if (!result) {
			await client.db.starboardMessages.insertData({
				id: this.id,
				messages: {}
			});
			result = await client.db.starboardMessages.getByID(this.id);
		}
		return result.messages;
	}

	async updateStarboardMessage({ originalMessageID, starMessageID, starcount }) {
		const { client } = this;
		let result1 = await client.db.starboardMessages.getByID(this.id);
		result1.messages[originalMessageID] = {
			starMessageID,
			starcount
		};
		const result2 = await client.db.starboardMessages.getAndReplace(this.id, result1);
		return result2;
	}

	async resolveStarboardMessage(id) {
		const { client } = this;
		let { messages } = await client.db.starboardMessages.getByID(this.id);
		const result = messages[id];
		if (!result) {
			return null;
		} else {
			return result;
		}
	}

	async deleteStarboardMessage(id) {
		const { client } = this;
		let result1 = await client.db.starboardMessages.getByID(this.id);
		delete result1.messages[id];
		const result = await client.db.starboardMessages.getAndReplace(this.id, result1);
		return result;
	}

	async getConfig() {
		const { client } = this;
		const config = await client.db.serverconfig.findOrCreate({ where: { id: this.id } });
		return config[0];
	}

	async updateConfig(data) {
		const { client } = this;
		const result = await client.db.guild.updateData(this.id, data);
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
