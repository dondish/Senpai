const packageJson                             = require('../package.json')
const moment                                  = require('moment');
const rethink                                 = require('rethinkdb')

module.exports = bot => {
  console.log('-----------------------------------------------------------------------------');
  console.log('Username:      ' + bot.user.username);
  console.log('ID:            ' + bot.user.id);
  console.log('Servers:       ' + bot.guilds.size );
  console.log('Channels:      ' + bot.channels.size);
  console.log('-----------------------------------------------------------------------------');
  console.log('Other API Status:')
  console.log('-----------------------------------------------------------------------------');
  bot.user.setGame(`%help || Version: ${packageJson.version}`)
  function createAndUseDB() {
    return new Promise(async function(resolve, reject) {
      const connection = await rethink.connect()
      rethink.dbList().run(connection, function(err, result) {
        if (err) reject(new Error("Error while try to fetch all DB from rethink"))
        if(!result.includes("Discord")) {
          rethink.dbCreate('Discord').run(connection, () => {
            connection.use('Discord')
            resolve(connection)
          })
        }else{
          connection.use('Discord')
          resolve(connection)
        }
      })
     });
  }
  function createTable() {
    return new Promise(async function(resolve, reject) {
    const connection = await createAndUseDB()
    rethink.tableList().run(connection, (err, result) => {
      if (err) reject(new Error("Something went wrong while trying to fetch all Tables"))
      if(!result.includes("OnlineTime")) {
        rethink.tableCreate('OnlineTime').run(connection, err => {
          if (err) reject(new Error("Something went wrong while trying to create a Table"))
          resolve(connection)
        })
      }else{
        resolve(connection)
      }
    })
    })
  }
  function createTable2() {
    return new Promise(async function(resolve, reject) {
      const connection = await createAndUseDB()
      rethink.tableList().run(connection, (err, result) => {
        if (err) reject(new Error("Something went wrong while trying to fetch all Tables"))
      if(!result.includes("economy")) {
        rethink.tableCreate('economy').run(connection, err => {
          if (err) reject(new Error("Something went wrong while trying to create a Table"))
          resolve()
        })
      }else{
        resolve()
      }
      })
    })
  }
  async function insertIntoDB(users) {
    const connection = await createTable();
    await createTable2();
    let timer = 0;
    users.forEach(user => {
      if(user.presence.status === 'offline') return
      rethink.table('OnlineTime').insert(
        {
          "id": `${user.id}`,
          "time": `${moment().unix()}`
        },
        {"conflict": "replace"}
      )
      .run(connection, () => {
      timer++;
      if(timer === users.size) connection.close()
      })
    });
  }

  insertIntoDB(bot.users)
};

