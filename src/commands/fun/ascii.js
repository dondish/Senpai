const Commands = require('../../structures/new/Command.js');
const ascii = require('ascii-art');
const info = {
	name: 'ascii',
	description: 'transform text to ascii art (only works on short sentence)',
	aliases: [],
	examples: ['ascii test', 'ascii this is cool']
};

class AsciiCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	run(msg, params) {
		const text = params.join(' ');
		if (!text) return msg.reply('You have to provide a word to display as ascii art!');
		ascii.font(text, 'Doom', output => {
			msg.channel.send(output, { code: 'ascii' });
		});
	}
}

module.exports = AsciiCommand;
