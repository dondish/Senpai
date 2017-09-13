const Extension = require('./Extend.js');

class UserExtension extends Extension {
	isBlacklisted(client) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await client.db.blacklist.getByID(this.id);
				if (result === null) {
					resolve(false);
				} else {
					resolve(true);
				}
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = UserExtension;
