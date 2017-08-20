const Events = require('../structures/new/Event.js')

class ReadyEvent extends Events {
    constructor(client) {
        super(client)
        this.name = 'ready'
    }

    run() {
        const client = this.client
        console.log('-----------------------------------------------------------------------------');
        console.log('Username:      ' + client.user.username);
        console.log('ID:            ' + client.user.id);
        console.log('Servers:       ' + client.guilds.size );
        console.log('Channels:      ' + client.channels.size);
        console.log('-----------------------------------------------------------------------------');
        client.user.setPresence({
            'game': {
                'name': `${client.config.prefix}help || Version: ${client.version}`,
                'type': 0
            }
        });
    }
}

module.exports = ReadyEvent
