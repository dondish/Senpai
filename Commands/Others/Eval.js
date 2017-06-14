const config                                = require('../../config/config.json');
exports.run = (client, msg, params) => {
    if(msg.author.id !== config.OwnerID) return msg.channel.send("Because of security measures, only the owner can execute this command!")
    function clean(text) {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
          }
        try {
        let code = params.join(" ");
        let evaled = eval(code);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
          msg.channel.send(clean(evaled), {"code": 'xl'});
          } catch (err) {
            msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }
}

exports.help = {
    'name': 'eval',
    'description': 'evaluate code on the bot (Because of security measures, only the owner can execute this command!)',
    'usage': 'eval [code]'
}

exports.alias = []
