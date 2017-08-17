const file = require('file')

module.exports = Client => {
    file.walk('./events', (err, dirPath, dirs, files) => {
        if (err) throw err
        files.forEach(element => {
            const name = element.slice(7)
            const EventClass = require(`../events/${name}`)
            const Event = new EventClass(Client)
            Client.on(Event.name, (parameter1, parameter2, parameter3) => Event.run(parameter1, parameter2, parameter3))
        });
    })
}
