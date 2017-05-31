const reqEvent = event => require(`../events/${event}`);
module.exports = client => {

  function Update()
  {
    client.on('presenceUpdate', reqEvent('presenceUpdate'))
  }

  client.on('ready', () => reqEvent('ready')(client));
  client.on('message', reqEvent('message'));
  client.on('messageUpdate', reqEvent('messageUpdate'));
  client.on('guildCreate', reqEvent('guildCreate'));
  client.on('guildDelete', reqEvent('guildDelete'));
  setTimeout(Update, 35000);
};
