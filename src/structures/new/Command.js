const { readFile } = require('fs');
const { parse } = require('sherlockjs');
const { RichEmbed } = require('discord.js');
const { colors, promisify } = require('./Util.js');

class Commands {
	constructor(client, info, group) {
		// Validate everything needed is there and right type
		this.constructor.validateInfo(client, info, group);
		// Add the client to this
		this.client = client;
		// Add the info stuff to this
		this.name = info.name;
		this.description = info.description;
		this.aliases = info.aliases;
		this.examples = info.examples;
		this.group = group;
	}

	static validateInfo(client, info, group) {
		if (!client) throw new Error('A client must be specified.');
		if (typeof info !== 'object') throw new TypeError('Command info must be an Object.');
		if (typeof info.name !== 'string') throw new TypeError('Command name must be a string.');
		if (info.name !== info.name.toLowerCase()) throw new Error('Command name must be lowercase.');
		if (typeof info.description !== 'string') throw new TypeError('Command description must be a string.');
		if (info.aliases && !Array.isArray(info.aliases)) {
			throw new Error('Aliases must be an Array.');
		}
		if (info.aliases && info.aliases.some(ali => typeof ali !== 'string')) {
			throw new Error('The aliases must be an array of Strings.');
		}
		if (info.aliases && info.aliases.some(ali => ali !== ali.toLowerCase())) {
			throw new Error('Strings in Aliases must be lowercase.');
		}
		if (!info.examples) throw new Error('Command examples must be specified.');
		if (info.examples && (!Array.isArray(info.examples) || info.examples.some(ali => typeof ali !== 'string'))) {
			throw new TypeError('Command examples must be an Array of strings.');
		}
		if (typeof group !== 'string') throw new TypeError('group name must be a string.');
	}

	async readFileAsync(path) {
		const func = promisify(readFile);
		const result = await func(path);
		return result;
	}

	parseTime(input) {
		const remindTime = parse(input);
		return remindTime;
	}

	validateTime(input) {
		const remindTime = parse(input);
		if (!remindTime.startDate) return false;
		return true;
	}

	clean(text) {
		if (typeof text === 'string') {
			return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
		} else {
			return text;
		}
	}

	format(seconds) {
		const { pad } = this;
		let hours = Math.floor(seconds / (60 * 60));
		let minutes = Math.floor(seconds % (60 * 60) / 60);
		let seconds2 = Math.floor(seconds % 60);

		return `${pad(hours)}:${pad(minutes)}:${pad(seconds2)}`;
	}

	pad(seconds) {
		return (seconds < 10 ? '0' : '') + seconds;
	}

	_constructTitles(data) {
		const array = [];
		const { _constructTitle } = this;
		for (let i = 0; i < 5; i++) {
			array.push(`\n${i + 1}:`);
			array.push(_constructTitle(i, data));
		}
		return array.join(' ');
	}

	_constructTitle(index, data) {
		const string1 = data[index].titles.en_jp ? data[index].titles.en_jp : '';
		const string2 = data[index].titles.en ? `/${data[index].titles.en}` : '';
		return `${string1}${string2}`;
	}

	_constructDM({ action, moderator, reason, serverName }) {
		const embed = new RichEmbed()
			.setDescription(`You Have been ${action} on ${serverName}`)
			.addField('Moderator', moderator)
			.addField('Reason', reason)
			.setColor(colors(action));
		return embed;
	}
}

module.exports = Commands;
