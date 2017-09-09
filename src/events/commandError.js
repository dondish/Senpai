const Events = require('../structures/new/Event.js')

class commandError extends Events {
    constructor(client) {
        super(client)
        this.name = 'commandError'
    }

    run(error, messageEvent, msg) {
        const client = this.client
        client.log.info("   ")
        client.log.info(`[Error]   ${error.name}: ${error.message}`)
        client.log.info(`          with this message ${msg.content}`)
        client.log.info("   ")
        client.users.get(client.config.ownerID).send(`The Following Error occourd "${error.name}: ${error.message}" for more info look at the logs!`)
    }
}

module.exports = commandError
