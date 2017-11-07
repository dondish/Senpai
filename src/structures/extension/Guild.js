const Extension = require('./Extend.js');
const Music = require('../new/Music.js');
const Economy = require('../new/Economy.js');
const rethink = require('rethinkdb');

class GuildExtension extends Extension {
	async getLeaderboard() {
		const { client } = this;
		const data = await client.db.money.filterAndSort({ guildID: this.id }, rethink.desc(element => rethink.add(element('cash'), element('bank')))
		);
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
		const config = await client.db.guild.getByID(this.id);
		return config;
	}

	async createConfig() {
		const { client } = this;
		const result = await client.db.guild.insertData({
			moderationRolesIDs: [],
			modlogID: 'None',
			musicID: 'None',
			musicRolesIDs: [],
			starboardID: 'None',
			prefix: 'None',
			musicLimited: false,
			starboardNeededReactions: 1,
			id: this.id
		});
		return result;
	}

	async updateConfig(data) {
		const { client } = this;
		const result = await client.db.guild.updateData(this.id, data);
		return result;
	}

	getLoop() {
		const music = this.getMusic();
		return music.loop;
	}

	setLoop(boolean) {
		const music = this.getMusic();
		music.loop = boolean;
	}

	getMusic() {
		if (!this.music) {
			this.music = new Music(this);
		}
		return this.music;
	}

	getEconomy() {
		if (!this.economy) {
			this.economy = new Economy(this.client);
		}
		return this.economy;
	}
}

module.exports = GuildExtension;
