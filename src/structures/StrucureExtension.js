const { Structures } = require('discord.js');

Structures.extend('GuildMember', DiscordGuildMember => class GuildMember extends DiscordGuildMember {
	get hasModrole() {
		const modRoles = this.client.gateways.guilds.getEntry(this.guild.id).get('modRoles');
		for (const id of this.permissions.keys()) {
			if (modRoles.include(id)) return true;
		}
		return false;
	}

	get hasMusicrole() {
		const musicRoles = this.client.gateways.guilds.getEntry(this.guild.id).get('musicRoles');
		for (const id of this.permissions.keys()) {
			if (musicRoles.include(id)) return true;
		}
		return false;
	}
});
