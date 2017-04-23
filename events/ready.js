const config                                = require('../config/config.js');
const MALjs                                 = require('MALjs');
const mal                                   = new MALjs(config.MyAnimeListUsername, config.MyAnimeListPassword);
module.exports = bot => {
  console.log('-----------------------------------------------------------------------------');
  console.log('Username:      ' + bot.user.username);
  console.log('ID:            ' + bot.user.id);
  console.log('Servers:       ' + bot.guilds.size );
  console.log('Channels:      ' + bot.channels.size);
  console.log('-----------------------------------------------------------------------------');
  console.log('Other API Status:')
  mal.verifyCredentials()
    .then(result => {
      if (undefined != result)
        {
          console.log("MAL API READY")
        }
    })
    .catch(err => console.error(err));
  console.log('-----------------------------------------------------------------------------');
  bot.user.setGame("%help")
};

