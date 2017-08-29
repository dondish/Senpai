const Commands = require('../../structures/new/Command.js')
const Canvas = require('canvas');
const fs = require("fs")
const snekfetch = require("snekfetch")
const info = {
    "name": "trap",
    "description": "turn the tables with your ultimate Yu-Gi-Oh trap card!",
    "aliases": [],
    "examples": ["trap", "trap @user"]
}

class TrapCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg) {
        fs.readFile('./materials/trap.png', async (err, file) => {
            if (err) throw err;
            const {Image} = Canvas;
            const canvas = new Canvas(316, 480);
            const ctx = canvas.getContext('2d')
            let base = new Image();
            let userPicture = new Image();
            base.src = file
            let avatar;
            if(msg.mentions.users.size > 0) {
                avatar = msg.mentions.users.first().displayAvatarURL
            } else {
                avatar = msg.author.displayAvatarURL
            }
            avatar = avatar.split(".")
            avatar = `${avatar[0]}.${avatar[1]}.${avatar[2]}.png?size=2048`
            const result = await snekfetch.get(avatar)
            userPicture.src = result.body
            ctx.drawImage(base, 0, 0, base.width, base.height);
            ctx.rotate(-0.15);
            ctx.drawImage(userPicture, 20, 45, 124, 124)
            await msg.channel.send({
                "files": [
                    {
                        "attachment": canvas.toBuffer(),
                        "name": 'trap.png'
                    }
                ]
             });
        });
    }
}

module.exports = TrapCommand
