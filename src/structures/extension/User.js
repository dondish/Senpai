const Extension = require('./Extend.js');

class UserExtension extends Extension {
	async isBlacklisted() {
		const { client } = this;
		const result = await client.db.blacklist.getByID(this.id);
		if (!result) {
			return false;
		} else {
			return true;
		}
	}
}

module.exports = UserExtension;
