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
		let { prefix, modlogChannel, starboardChannel, musicChannel, modRoles, musicRoles, musicLimited, starcount, welcomeEnabled, welcomeChannel, welcomeMessage, leaveMessage } = await msg.guild.getConfig();
		if (!prefix) prefix = 'None';
		let ModlogChannel = msg.guild.channels.get(modlogChannel);
		if (!ModlogChannel) ModlogChannel = 'None';
		let StarboardChannel = msg.guild.channels.get(starboardChannel);
		if (!StarboardChannel) StarboardChannel = 'None';
		let MusicChannel = msg.guild.channels.get(musicChannel);
		if (!MusicChannel) MusicChannel = 'None';
		let ModerationRoles = modRoles.map(ID => `<@&${ID}>`).join(', ');
		if (ModerationRoles.length === 0) ModerationRoles = 'None';
		let MusicRoles = musicRoles.map(ID => `<@&${ID}>`).join(', ');
		if (MusicRoles.length === 0) MusicRoles = 'None';
		let musicboolean = musicLimited.toString();
		const neededStars = starcount.toString();
		welcomeEnabled = welcomeEnabled.toString();
		if (!welcomeChannel) welcomeChannel = 'None';
		const embed = new RichEmbed()
			.setTitle(`Configuration for ${msg.guild.name}`)
			.setThumbnail(msg.guild.iconURL)
			.setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
			.addField('Custom Prefix', prefix, true)
			.addField('Modlog Channel', ModlogChannel, true)
			.addField('Starboard Channel', StarboardChannel, true)
			.addField('Music Channel', MusicChannel, true)
			.addField('Moderation Roles', ModerationRoles, true)
			.addField('Music Roles', MusicRoles, true)
			.addField('Music feature limited to role?', musicboolean, true)
			.addField('Stars needed for Starboard', neededStars, true)
			.addField('Welcome Messages enabled?', welcomeEnabled, true)
			.addField('Welcome Channel', welcomeChannel, true)
			.addField('Welcome Message', welcomeMessage, true)
			.addField('Leave Message', leaveMessage, true)
			.setTimestamp();
		msg.channel.send(embed);
	}

	async prefix(msg, passedArgs) {
		const [arg1, arg2] = passedArgs;
		if (!arg1) {
			return msg.reply('You must provide an second parameter!');
		} else if (arg1 === 'set') {
			if (!arg2) {
				return msg.reply('you must add a prefix to set!');
			}
			if (arg2.length > 3) {
				return msg.reply("a prefix's length must be between 1-3 characters long!");
			}
			await msg.guild.updateConfig({ prefix: arg2 });
			const embed = new RichEmbed()
				.setTitle(`Updated Prefix for ${msg.guild.name}`)
				.addField('Updated Prefix to', arg2)
				.setTimestamp();
			msg.channel.send(embed);
		} else if (arg1 === 'remove' || arg1 === 'delete') {
			await msg.guild.updateConfig({ prefix: null });
			msg.channel.send('i deleted the custom prefix from this server!');
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async modlog(msg, passedArgs) {
		const [arg1, arg2] = passedArgs;
		if (!arg1) {
			return msg.reply('You must provide an second parameter!');
		} else if (arg1 === 'set') {
			if (!arg2) {
				return msg.reply('you must add channelID or Mention for this!');
			}
			let modlog;
			if (msg.mentions.channels.size > 0) {
				modlog = msg.mentions.channels.first();
			} else {
				modlog = msg.guild.channels.get(arg2);
				if (!modlog) {
					return msg.reply('Your provided ID is wrong! use a channelmention instead maybe');
				}
			}
			await msg.guild.updateConfig({ modlogChannel: modlog.id });
			const embed = new RichEmbed()
				.setTitle(`Updated Modlog for ${msg.guild.name}`)
				.addField('New Modlog', modlog.toString())
				.setTimestamp();
			msg.channel.send(embed);
		} else if (arg1 === 'remove' || arg1 === 'delete') {
			await msg.guild.updateConfig({ modlogChannel: null });
			msg.channel.send('i deleted the modlog channel from my config!');
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async musiclog(msg, passedArgs) {
		const [arg1, arg2] = passedArgs;
		if (!arg1) {
			return msg.reply('You must provide an second parameter!');
		} else if (arg1 === 'set') {
			if (!arg2) {
				return msg.reply('you must add channelID or Mention for this!');
			}
			let musiclog;
			if (msg.mentions.channels.size > 0) {
				musiclog = msg.mentions.channels.first();
			} else {
				musiclog = msg.guild.channels.get(arg2);
				if (!musiclog) {
					return msg.reply('Your provided ID is wrong! use a channelmention instead maybe');
				}
			}
			await msg.guild.updateConfig({ musicChannel: musiclog.id });
			const embed = new RichEmbed()
				.setTitle(`Updated Musiclog for ${msg.guild.name}`)
				.addField('New Musiclog', musiclog.toString())
				.setTimestamp();
			msg.channel.send(embed);
		} else if (arg1 === 'remove' || arg1 === 'delete') {
			await msg.guild.updateConfig({ musicChannel: null });
			msg.channel.send('i deleted the Musiclog channel from my config!');
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async starboard(msg, passedArgs) {
		const [arg1, arg2] = passedArgs;
		if (!arg1) {
			return msg.reply('You must provide an second parameter!');
		} else if (arg1 === 'set') {
			if (!arg2) {
				return msg.reply('you must add channelID or Mention for this!');
			}
			let starboard;
			if (msg.mentions.channels.size > 0) {
				starboard = msg.mentions.channels.first();
			} else {
				starboard = msg.guild.channels.get(arg2);
				if (!starboard) {
					return msg.reply('Your provided ID is wrong! use a channelmention instead maybe');
				}
			}
			await msg.guild.updateConfig({ starboardChannel: starboard.id });
			const embed = new RichEmbed()
				.setTitle(`Updated Starboard Channel for ${msg.guild.name}`)
				.addField('New Starboard Channel', starboard.toString())
				.setTimestamp();
			msg.channel.send(embed);
		} else if (arg1 === 'remove' || arg1 === 'delete') {
			await msg.guild.updateConfig({ starboardChannel: null });
			msg.channel.send('i deleted the Starboard channel from my config!');
		} else if (arg1 === 'count' || arg1 === 'votes') {
			const number = Number(arg2);
			if (number <= 0 || isNaN(number)) return msg.reply('the third parameter must be a number greater than 0 !');
			await msg.guild.updateConfig({ starboardNeededReactions: number });
			const embed = new RichEmbed()
				.setTitle(`Updated needed Stars for ${msg.guild.name}`)
				.addField('New required Star Count', `${number}`)
				.setTimestamp();
			msg.channel.send(embed);
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async modrole(msg, passedArgs) {
		const [arg1, arg2] = passedArgs;
		if (await msg.member.getPermissionsLevel() > 2) {
			return msg.reply('You need to be the owner or have Administrator permission to edit the moderation roles!');
		}
		if (!arg1) {
			return msg.reply('You must provide an second parameter!');
		} else if (arg1 === 'add') {
			if (!arg2) {
				return msg.reply('you must add RoleID or Mention for this!');
			}
			let role;
			if (msg.mentions.roles.size > 0) {
				role = msg.mentions.roles.first();
			} else {
				role = msg.guild.roles.get(arg2);
				if (!role) {
					return msg.reply('Your provided ID is wrong! use a Rolemention instead maybe');
				}
			}
			const result = await msg.guild.getConfig();
			const array = result.modRoles;
			if (array.includes(role.id)) {
				return msg.reply('this Role is already an Modrole on this server!');
			}
			array.push(role.id);
			await msg.guild.updateConfig({ modRoles: array });
			let Roles = array.map(ID => `<@&${ID}>`).join(', ');
			if (!Roles) Roles = 'None';
			const embed = new RichEmbed()
				.setTitle(`Added Role ${role.name} to the Modroles`)
				.addField('updated Modroles', `${Roles}`)
				.setTimestamp();
			msg.channel.send(embed);
		} else if (arg1 === 'remove' || arg1 === 'delete') {
			if (!arg2) {
				return msg.reply('you must add RoleID or Mention for this!');
			}
			let role;
			if (msg.mentions.roles.size > 0) {
				role = msg.mentions.roles.first();
			} else {
				role = msg.guild.roles.get(arg2);
				if (!role) {
					return msg.reply('Your provided ID is wrong! use a RoleMention instead maybe');
				}
			}
			const result = await msg.guild.getConfig();
			const array = result.modRoles;
			if (!array.includes(role.id)) {
				return msg.reply('this Role is not an Modrole on this server!');
			}
			const index = array.indexOf(role.id);
			array.splice(index, 1);
			await msg.guild.updateConfig({ modRoles: array });
			let Roles = array.map(ID => `<@&${ID}>`).join(', ');
			if (!Roles) Roles = 'None';
			const embed = new RichEmbed()
				.setTitle(`deleted Role ${role.name} from the Modroles`)
				.addField('updated Modroles', `${Roles}`)
				.setTimestamp();
			msg.channel.send(embed);
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async musicrole(msg, passedArgs) { // eslint-disable-line complexity
		const [arg1, arg2] = passedArgs;
		if (!arg1) {
			return msg.reply('You must provide an second parameter!');
		} else if (arg1 === 'add') {
			if (!arg2) {
				return msg.reply('you must add RoleID or Mention for this!');
			}
			let role;
			if (msg.mentions.roles.size > 0) {
				role = msg.mentions.roles.first();
			} else {
				role = msg.guild.roles.get(arg2);
				if (!role) {
					return msg.reply('Your provided ID is wrong! use a Rolemention instead maybe');
				}
			}
			const result = await msg.guild.getConfig();
			const array = result.musicRoles;
			if (array.includes(role.id)) {
				return msg.reply('this Role is already an Musicrole on this server!');
			}
			array.push(role.id);
			await msg.guild.updateConfig({ musicRoles: array });
			const Roles = array.map(ID => `<@&${ID}>`).join(', ');
			const embed = new RichEmbed()
				.setTitle(`Added Role ${role.name} to the Musicroles`)
				.addField('updated Musicroles', `${Roles}`)
				.setTimestamp();
			msg.channel.send(embed);
		} else if (arg1 === 'remove' || arg1 === 'delete') {
			if (!arg2) {
				return msg.reply('you must add RoleID or Mention for this!');
			}
			let role;
			if (msg.mentions.roles.size > 0) {
				role = msg.mentions.roles.first();
			} else {
				role = msg.guild.roles.get(arg2);
				if (!role) {
					return msg.reply('Your provided ID is wrong! use a channelmention instead maybe');
				}
			}
			const result = await msg.guild.getConfig();
			const array = result.musicRoles;
			if (!array.includes(role.id)) {
				return msg.reply('this Role is not an Musicrole on this server!');
			}
			const index = array.indexOf(role.id);
			array.splice(index, 1);
			await msg.guild.updateConfig({ musicRoles: array });
			let Roles = array.map(ID => `<@&${ID}>`).join(', ');
			if (!Roles) Roles = 'None';
			const embed = new RichEmbed()
				.setTitle(`deleted Role ${role.name} from the Musicrole`)
				.addField('updated Musicroles', `${Roles}`)
				.setTimestamp();
			msg.channel.send(embed);
		} else if (arg1 === 'limit') {
			if (!arg2) {
				return msg.reply('You must provide an third parameter!');
			} else if (arg2 === 'enable' || arg2 === 'on') {
				await msg.guild.updateConfig({ musicLimited: true });
				msg.channel.send('enabled Limitation of my music feature to the Musicroles!');
			} else if (arg2 === 'disable' || arg2 === 'off') {
				await msg.guild.updateConfig({ musicLimited: false });
				msg.channel.send('disabled Limitation of my music feature to the Musicroles!');
			} else {
				return msg.reply('You provided an wrong third parameter');
			}
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async welcome(msg, passedArgs) {
		const [arg1, arg2, arg3, ...rest] = passedArgs;
		if (!arg1) {
			return msg.reply('You must provide an second parameter!');
		} else if (arg2 === 'enable' || arg2 === 'on') {
			await msg.guild.updateConfig({ welcomeEnabled: true });
			msg.channel.send('enabled welcome messages!');
		} else if (arg2 === 'disable' || arg2 === 'off') {
			await msg.guild.updateConfig({ welcomeEnabled: false });
			msg.channel.send('disabled welcome messages!');
		} else if (arg2 === 'channel') {
			if (arg3 === 'set') {
				let channel;
				if (msg.mentions.roles.size > 0) {
					channel = msg.mentions.roles.first().id;
				} else {
					channel = msg.guild.roles.get(arg2).id;
					if (!channel) {
						return msg.reply('Your provided ID is wrong! use a Channelmention instead maybe');
					}
				}
				await msg.guild.updateConfig({ welcomeChannel: channel });
			} else if (arg3 === 'remove') {
				await msg.guild.updateConfig({ welcomeChannel: null });
			}
		} else if (arg2 === 'message') {
			rest.unshift(arg3);
			const welcomeMessage = rest.join(' ');
			await msg.guild.updateConfig({ welcomeMessage });
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async leave(msg, passedArgs) {
		const [arg1, arg2, arg3, ...rest] = passedArgs;
		if (!arg1) {
			return msg.reply('You must provide an second parameter!');
		} else if (arg2 === 'message') {
			rest.unshift(arg3);
			const leaveMessage = rest.join(' ');
			await msg.guild.updateConfig({ leaveMessage });
		} else {
			return msg.reply('You provided an wrong second parameter');
		}
	}

	async run(msg, args) {
		let [arg1, ...argsToPass] = args;
		if (!arg1) {
			await this.showConfig(msg);
		} else {
			arg1 = arg1.toLowerCase();
			argsToPass = argsToPass.map(param => param.toLowerCase());
			const permissionLevel = await msg.member.getPermissionsLevel();
			if (permissionLevel > 3) return msg.reply("You dont have permission to do that since you dont have a moderation Role and also aren't the Owner of this server!");
			switch (arg1) {
				case 'prefix':
					await this.prefix(msg, argsToPass);
					break;
				case 'modlog':
					await this.modlog(msg, argsToPass);
					break;
				case 'musiclog':
					await this.musiclog(msg, argsToPass);
					break;
				case 'starboard':
					await this.starboard(msg, argsToPass);
					break;
				case 'modrole':
					await this.modrole(msg, argsToPass);
					break;
				case 'musicrole':
					await this.musicrole(msg, argsToPass);
					break;
				case 'welcome':
					await this.welcome(msg, argsToPass);
					break;
				default:
					return msg.reply('seems like you provided a first parameter what is wrong maybe look the usage up again!');
			}
		}
	}
}

module.exports = ConfigCommand;
