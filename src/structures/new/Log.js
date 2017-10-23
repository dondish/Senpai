const winston = require('winston');
const fs = require('fs');

class Log {
	constructor(shardID) {
		this.shardID = shardID;
		if (!fs.existsSync('logs')) {
			fs.mkdirSync('logs');
		}
		this.winston = new winston.Logger({
			transports: [
				new winston.transports.Console({
					timestamp: this.tsFormat,
					colorize: true,
					level: 'info'
				}),
				new winston.transports.File({
					filename: `logs/Senpai_shard${shardID}`,
					timestamp: this.tsFormat,
					level: 'debug'
				})
			]
		});
	}

	tsFormat() {
		return new Date().toLocaleTimeString();
	}

	info(content) {
		this.winston.log('info', `[Shard:${this.shardID}] ${content}`);
	}

	error(content) {
		this.winston.log('error', `[Shard:${this.shardID}] ${content}`);
	}

	debug(content) {
		this.winston.log('debug', `[Shard:${this.shardID}] ${content}`);
	}
}

module.exports = Log;
