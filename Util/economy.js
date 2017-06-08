const rethink = require('rethinkdb')
const recentlyUpdated = [];

exports.run = async (client, user) => {
  if (recentlyUpdated.includes(user.id)) return;
  recentlyUpdated.push(user.id);
  function removeIDFromArray()
  {
    recentlyUpdated.splice(recentlyUpdated.indexOf(user.id), 1)
  }
 const connection = await rethink.connect()
 rethink.db('Discord').table('economy')
 .get(user.id)
 .run(connection, (err, result) => {
     if (err) throw err
     if(result === null) return connection.close()
     const money = result.Cash
     let newMoney = money + 10
     rethink.db('Discord').table('economy')
     .update({"Cash": newMoney})
     .run(connection, err => {
         if (err) throw err
         connection.close()
     })
 })
  setTimeout(removeIDFromArray, 5000);
}

