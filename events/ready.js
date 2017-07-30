const packageJson                             = require('../package.json')
const config                                  = require('../config/config.json')
const moment                                  = require('moment');
const rethink                                 = require('rethinkdb')
let firststartup                              = true

module.exports = bot => {
  console.log('-----------------------------------------------------------------------------');
  console.log('Username:      ' + bot.user.username);
  console.log('ID:            ' + bot.user.id);
  console.log('Servers:       ' + bot.guilds.size );
  console.log('Channels:      ' + bot.channels.size);
  console.log('-----------------------------------------------------------------------------');
  bot.user.setGame(`${config.prefix}help || Version: ${packageJson.version}`)
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
  function createTable3() {
    return new Promise(async (resolve, reject) => {
      const connection = await createAndUseDB()
      rethink.tableList().run(connection, (err, result) => {
          if(err) reject(new Error("Something went wrong while trying to fetch all Tables"));
        if(!result.includes("guildConfig")) {
          rethink.tableCreate('guildConfig').run(connection, err => {
            if (err) reject(new Error("Something went wrong while trying to create a Table"));
              resolve();
          })
        }else{
          resolve();
        }
      })
    })
  }
    function createTable4() {
    return new Promise(async (resolve, reject) => {
      const connection = await createAndUseDB()
      rethink.tableList().run(connection, (err, result) => {
          if(err) reject(new Error("Something went wrong while trying to fetch all Tables"));
        if(!result.includes("StarboardMessages")) {
          rethink.tableCreate('StarboardMessages').run(connection, err => {
            if (err) reject(new Error("Something went wrong while trying to create a Table"));
              resolve();
          })
        }else{
          resolve();
        }
      })
    })
  }
  async function insertIntoDB(users) {
    try{
      const connection = await createTable();
      await createTable2();
      await createTable3();
      await createTable4();
        users.forEach(user => {
          if(user.presence.status === 'offline') return
          rethink.table('OnlineTime').insert(
            {
              "id": `${user.id}`,
              "time": `${moment().unix()}`
            },
            {"conflict": "replace"}
          )
          .run(connection, err => {
            if (err) throw err
          })
          setTimeout(function() {
          connection.close()
        }, 180000)
        });
    }catch(err){
    throw new Error('had the following error with the DB:' + err);
    }
  }
  if(firststartup) {
    insertIntoDB(bot.users)
    firststartup = false
  }
}

