const reqEvent = event => require(`../events/${event}`);
module.exports = client => {

  function Update()
  {
    client.on('presenceUpdate', reqEvent('presenceUpdate'))
  }

  client.on('ready', () => reqEvent('ready')(client));
  client.on('message', reqEvent('message'));
  setTimeout(Update, 40000);
};
