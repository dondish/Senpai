const Commands = require('../../structures/new/Command.js')
const snekfetch = require('snekfetch')
const info = {
    "name": "cat",
    "description": "shows a picture of a Cat",
    "aliases": ["pussy"],
    "examples": ["cat"]
}

class CatCommand extends Commands {

    constructor(client, group) {
        super(client, info, group)
    }

    async run(msg) {
        const response = await snekfetch.get("http://random.cat/meow")
        const Link = response.body.file
        msg.channel.send("enjoy your cat", {"files": [Link]})
    }
}

module.exports = CatCommand
