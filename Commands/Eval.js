exports.run = (client, msg, params) => {
    if(msg.author.id != "184632227894657025") return msg.channel.sendMessage("Because of security measures, only the owner can execute this command!")
    function clean(text) {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
          }
        try {
        var code = params.join(" ");
        var evaled = eval(code);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
          msg.channel.sendCode("xl", clean(evaled));
          } catch (err) {
            msg.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }
}

exports.help = {
    'name': 'Eval',
    'description': 'Evaluate code on the Bot (Because of security measures, only the owner can execute this command!)',
    'usage': 'Eval [Code]'
}
