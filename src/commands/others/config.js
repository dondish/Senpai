const Commands = require('../../structures/new/Command.js');
const { RichEmbed } = require('discord.js');
const info = {
	name: 'config',
	description: 'shows/changes the config of this server',
	aliases: ['cfg'],
	examples: ['config', 'config Musiclog set #channel', 'config Modlog set #channel', 'config Modlog delete', 'config Modrole add @Role', 'config Musicrole add ROLE_ID_HERE', 'config Musicrole limit enable', 'config Musicrole limit disable']
};

class ConfigCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async showConfig(msg) {
		const result = await msg.guild.getConfig(this.client);
		let ModlogChannel = msg.guild.channels.get(result.modlogID);
		if (!ModlogChannel) ModlogChannel = 'None';
		let StarboardChannel = msg.guild.channels.get(result.starboardID);
		if (!StarboardChannel) StarboardChannel = 'None';
		let MusicChannel = msg.guild.channels.get(result.musicID);
		if (!MusicChannel) MusicChannel = 'None';
		let ModerationRoles = result.moderationRolesIDs.map(ID => `<@&${ID}>`).join(', ');
		if (ModerationRoles.length === 0) ModerationRoles = 'None';
		let MusicRoles = result.musicRolesIDs.map(ID => `<@&${ID}>`).join(', ');
		if (MusicRoles.length === 0) MusicRoles = 'None';
		let musicboolean = result.musicLimited;
		if (musicboolean) {
			musicboolean = 'true';
		} else {
			musicboolean = 'false';
		}
		let neededStars = '1';
		if (result.starboardNeededReactions) {
			neededStars = `${result.starboardNeededReactions}`;
		}
		const embed = new RichEmbed()
			.setTitle(`Configuration for ${msg.guild.name}`)
			.setThumbnail(msg.guild.iconURL)
			.setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
			.addField('Server specific prefix', `${result.prefix}`)
			.addField('Modlog Channel', ModlogChannel)
			.addField('Starboard Channel', StarboardChannel)
			.addField('Music Channel', MusicChannel)
			.addField('Moderation Roles', ModerationRoles)
			.addField('Music Roles', MusicRoles)
			.addField('Music feature limited to role?', musicboolean)
			.addField('needed Stars for Starboard', neededStars)
			.setTimestamp()
			.setFooter('Senpai Bot by Yukine');
		msg.channel.send({ embed });
	}
	async prefix(msg, param1, param2, param3) {
		if (!param2) {
			return msg.reply('You must provide an second parameter!');
		} else if (param2 === 'set') {
			try {
				if (!param3) {
					return msg.reply('you must add a prefix to set!');
				}
				if (param3.length > 3) {
					return msg.reply("a prefix's length must be between 1-3 characters long!");
				}
				await msg.guild.updateConfig(this.client, { prefix: param3 });
				const embed = new RichEmbed()
					.setTitle(`Updated Prefix for ${msg.guild.name}`)
					.addField('New Prefix', param3)
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				msg.channel.send({ embed });
			} catch (error) {
				return msg.reply('im sorry i had an error with my Database please try again!');
			}
		} else if (param2 === 'remove' || param2 === 'delete') {
			try {
				await msg.guild.updateConfig(this.client, { prefix: 'None' });
				msg.channel.send('i deleted the custom prefix from this server!');
			} catch (error) {
				return msg.reply('im sorry i had an error with my Database please try again!');
			}
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async modlog(msg, param1, param2, param3) {
		if (!param2) {
			return msg.reply('You must provide an second parameter!');
		} else if (param2 === 'set') {
			try {
				if (!param3) {
					return msg.reply('you must add channelID or Mention for this!');
				}
				let modlog;
				if (msg.mentions.channels.size > 0) {
					modlog = msg.mentions.channels.first();
				} else {
					modlog = msg.guild.channels.get(param3);
					if (!modlog) {
						return msg.reply('Your provided ID is wrong! use a channelmention instead maybe');
					}
				}
				await msg.guild.updateConfig(this.client, { modlogID: modlog.id });
				const embed = new RichEmbed()
					.setTitle(`Updated Modlog for ${msg.guild.name}`)
					.addField('New Modlog', modlog.toString())
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				msg.channel.send({ embed });
			} catch (error) {
				return msg.reply('im sorry i had an error with my Database please try again!');
			}
		} else if (param2 === 'remove' || param2 === 'delete') {
			try {
				await msg.guild.updateConfig(this.client, { modlogID: 'None' });
				msg.channel.send('i deleted the modlog channel from my config!');
			} catch (error) {
				return msg.reply('im sorry i had an error with my Database please try again!');
			}
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async musiclog(msg, param1, param2, param3) {
		if (!param2) {
			return msg.reply('You must provide an second parameter!');
		} else if (param2 === 'set') {
			try {
				if (!param3) {
					return msg.reply('you must add channelID or Mention for this!');
				}
				let musiclog;
				if (msg.mentions.channels.size > 0) {
					musiclog = msg.mentions.channels.first();
				} else {
					musiclog = msg.guild.channels.get(param3);
					if (!musiclog) {
						return msg.reply('Your provided ID is wrong! use a channelmention instead maybe');
					}
				}
				await msg.guild.updateConfig(this.client, { musicID: musiclog.id });
				const embed = new RichEmbed()
					.setTitle(`Updated Musiclog for ${msg.guild.name}`)
					.addField('New Musiclog', musiclog.toString())
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				msg.channel.send({ embed });
			} catch (error) {
				return msg.reply('im sorry i had an error with my Database please try again!');
			}
		} else if (param2 === 'remove' || param2 === 'delete') {
			try {
				await msg.guild.updateConfig(this.client, { musicID: 'None' });
				msg.channel.send('i deleted the Musiclog channel from my config!');
			} catch (error) {
				return msg.reply('im sorry i had an error with my Database please try again!');
			}
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async starboard(msg, param1, param2, param3) {
		if (!param2) {
			return msg.reply('You must provide an second parameter!');
		} else if (param2 === 'set') {
			try {
				if (!param3) {
					return msg.reply('you must add channelID or Mention for this!');
				}
				let starboard;
				if (msg.mentions.channels.size > 0) {
					starboard = msg.mentions.channels.first();
				} else {
					starboard = msg.guild.channels.get(param3);
					if (!starboard) {
						return msg.reply('Your provided ID is wrong! use a channelmention instead maybe');
					}
				}
				await msg.guild.updateConfig(this.client, { starboardID: starboard.id });
				const embed = new RichEmbed()
					.setTitle(`Updated Starboard Channel for ${msg.guild.name}`)
					.addField('New Starboard Channel', starboard.toString())
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				msg.channel.send({ embed });
			} catch (error) {
				return msg.reply('im sorry i had an error with my Database please try again!');
			}
		} else if (param2 === 'remove' || param2 === 'delete') {
			try {
				await msg.guild.updateConfig(this.client, { starboardID: 'None' });
				msg.channel.send('i deleted the Starboard channel from my config!');
			} catch (error) {
				return msg.reply('im sorry i had an error with my Database please try again!');
			}
		} else if (param2 === 'count' || param2 === 'votes') {
			try {
				const number = Number(param3);
				if (number <= 0 || isNaN(number)) return msg.reply('the third parameter must be a number greater than 0 !');
				await msg.guild.updateConfig(this.client, { starboardNeededReactions: number });
				const embed = new RichEmbed()
					.setTitle(`Updated needed Stars for ${msg.guild.name}`)
					.addField('New required Star Count', `${number}`)
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				msg.channel.send({ embed });
			} catch (error) {
				return msg.reply('im sorry i had an error with my Database please try again!');
			}
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async modrole(msg, param1, param2, param3) {
		if (await msg.member.getPermissionsLevel(this.client) > 1) {
			return msg.reply('Only the Owner can edit the Moderation Roles!');
		}
		if (!param2) {
			return msg.reply('You must provide an second parameter!');
		} else if (param2 === 'add') {
			try {
				if (!param3) {
					return msg.reply('you must add RoleID or Mention for this!');
				}
				let role;
				if (msg.mentions.roles.size > 0) {
					role = msg.mentions.roles.first();
				} else {
					role = msg.guild.roles.get(param3);
					if (!role) {
						return msg.reply('Your provided ID is wrong! use a Rolemention instead maybe');
					}
				}
				const result = await msg.guild.getConfig(this.client);
				const array = result.moderationRolesIDs;
				if (array.includes(role.id)) {
					return msg.reply('this Role is already an Modrole on this server!');
				}
				array.push(role.id);
				await msg.guild.updateConfig(this.client, { moderationRolesIDs: array });
				let Roles = array.map(ID => `<@&${ID}>`).join(', ');
				if (!Roles) Roles = 'None';
				const embed = new RichEmbed()
					.setTitle(`Added Role ${role.name} to the Modroles`)
					.addField('updated Modroles', `${Roles}`)
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				msg.channel.send({ embed });
			} catch (error) {
				return msg.reply(`im sorry i had the following error ${error.message}`);
			}
		} else if (param2 === 'remove' || param2 === 'delete') {
			try {
				if (!param3) {
					return msg.reply('you must add RoleID or Mention for this!');
				}
				let role;
				if (msg.mentions.roles.size > 0) {
					role = msg.mentions.roles.first();
				} else {
					role = msg.guild.roles.get(param3);
					if (!role) {
						return msg.reply('Your provided ID is wrong! use a RoleMention instead maybe');
					}
				}
				const result = await msg.guild.getConfig(this.client);
				const array = result.moderationRolesIDs;
				if (!array.includes(role.id)) {
					return msg.reply('this Role is not an Modrole on this server!');
				}
				const index = array.indexOf(role.id);
				array.splice(index, 1);
				await msg.guild.updateConfig(this.client, { moderationRolesIDs: array });
				let Roles = array.map(ID => `<@&${ID}>`).join(', ');
				if (!Roles) Roles = 'None';
				const embed = new RichEmbed()
					.setTitle(`deleted Role ${role.name} from the Modroles`)
					.addField('updated Modroles', `${Roles}`)
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				msg.channel.send({ embed });
			} catch (error) {
				return msg.reply(`im sorry i had the following error ${error.message}`);
			}
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async musicrole(msg, param1, param2, param3) { // eslint-disable-line complexity  
		if (!param2) {
			return msg.reply('You must provide an second parameter!');
		} else if (param2 === 'add') {
			try {
				if (!param3) {
					return msg.reply('you must add RoleID or Mention for this!');
				}
				let role;
				if (msg.mentions.roles.size > 0) {
					role = msg.mentions.roles.first();
				} else {
					role = msg.guild.roles.get(param3);
					if (!role) {
						return msg.reply('Your provided ID is wrong! use a Rolemention instead maybe');
					}
				}
				const result = await msg.guild.getConfig(this.client);
				const array = result.musicRolesIDs;
				if (array.includes(role.id)) {
					return msg.reply('this Role is already an Musicrole on this server!');
				}
				array.push(role.id);
				await msg.guild.updateConfig(this.client, { musicRolesIDs: array });
				const Roles = array.map(ID => `<@&${ID}>`).join(', ');
				const embed = new RichEmbed()
					.setTitle(`Added Role ${role.name} to the Musicroles`)
					.addField('updated Musicroles', `${Roles}`)
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				msg.channel.send({ embed });
			} catch (error) {
				return msg.reply(`im sorry i had the following error ${error.message}`);
			}
		} else if (param2 === 'remove' || param2 === 'delete') {
			try {
				if (!param3) {
					return msg.reply('you must add RoleID or Mention for this!');
				}
				let role;
				if (msg.mentions.roles.size > 0) {
					role = msg.mentions.roles.first();
				} else {
					role = msg.guild.roles.get(param3);
					if (!role) {
						return msg.reply('Your provided ID is wrong! use a channelmention instead maybe');
					}
				}
				const result = await msg.guild.getConfig(this.client);
				const array = result.musicRolesIDs;
				if (!array.includes(role.id)) {
					return msg.reply('this Role is not an Musicrole on this server!');
				}
				const index = array.indexOf(role.id);
				array.splice(index, 1);
				await msg.guild.updateConfig(this.client, { musicRolesIDs: array });
				let Roles = array.map(ID => `<@&${ID}>`).join(', ');
				if (!Roles) Roles = 'None';
				const embed = new RichEmbed()
					.setTitle(`deleted Role ${role.name} from the Musicrole`)
					.addField('updated Musicroles', `${Roles}`)
					.setTimestamp()
					.setFooter('Senpai Bot by Yukine');
				msg.channel.send({ embed });
			} catch (error) {
				return msg.reply(`im sorry i had the following error ${error.message}`);
			}
		} else if (param2 === 'limit') {
			if (!param3) {
				return msg.reply('You must provide an third parameter!');
			} else if (param3 === 'enable' || param3 === 'on') {
				await msg.guild.updateConfig(this.client, { musicLimited: true });
				msg.channel.send('enabled Limitation of my music feature to the Musicroles!');
			} else if (param3 === 'disable' || param3 === 'off') {
				await msg.guild.updateConfig(this.client, { musicLimited: false });
				msg.channel.send('disabled Limitation of my music feature to the Musicroles!');
			} else {
				return msg.reply('You provided an wrong third parameter');
			}
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async run(msg, params) {
		let [param1, param2, param3, param4] = params;
		if (!param1) {
			this.showConfig(msg);
		} else {
			param1 = param1.toLowerCase();
			if (param2) param2 = param2.toLowerCase();
			if (param3) param3 = param3.toLowerCase();
			if (param4) param4 = param4.toLowerCase();
			const permissionLevel = await msg.member.getPermissionsLevel(this.client);
			if (permissionLevel > 2) return msg.reply("You dont have permission to do that since you dont have a moderation Role and also aren't the Owner of this server!");
			switch (param1) {
				case 'prefix':
					this.prefix(msg, param1, param2, param3, param4);
					break;
				case 'modlog':
					this.modlog(msg, param1, param2, param3, param4);
					break;
				case 'musiclog':
					this.musiclog(msg, param1, param2, param3, param4);
					break;
				case 'starboard':
					this.starboard(msg, param1, param2, param3, param4);
					break;
				case 'modrole':
					this.modrole(msg, param1, param2, param3, param4);
					break;
				case 'musicrole':
					this.musicrole(msg, param1, param2, param3, param4);
					break;
				default:
					return msg.reply('seems like you provided a first parameter what is wrong maybe look the usage up again!');
			}
		}
	}
}

module.exports = ConfigCommand;
