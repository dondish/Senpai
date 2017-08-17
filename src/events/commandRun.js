const Events = require('../structures/new/Event.js')
const chalk = require('chalk')

class commandRun extends Events {
    constructor(client) {
        super(client)
        this.name = 'commandRun'
    }

    run(messageEvent, msg) {
        console.log(chalk.blue(`[Command]   ${msg.author.tag}/${msg.author.id} (${msg.content})`))
    }
}

module.exports = commandRun
