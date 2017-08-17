const Events = require('../structures/new/Event.js')
const chalk = require('chalk')

class commandError extends Events {
    constructor(client) {
        super(client)
        this.name = 'commandError'
    }

    run(error, messageEvent, msg) {
        const client = this.client
        console.log("   ")
        console.log(chalk.red(`[Error]   ${error.name}: ${error.message}`))
        console.log(chalk.red(`          with this message ${msg.content}`))
        console.log("   ")
        client.users.get(client.config.ownerID).send('An error occurred. look at the Logs!')
    }
}

module.exports = commandError
