const rethink = require('rethinkdb')
const recentlyUpdated = [];

exports.messageUpdate = (client, user) => {
  if (recentlyUpdated.includes(user.id)) return;
  recentlyUpdated.push(user.id);
  function removeIDFromArray()
  {
    recentlyUpdated.splice(recentlyUpdated.indexOf(user.id), 1)
  }
  async function addMoney() {
  const connection = await rethink.connect()
  rethink.db('Discord').table('economy')
    .get(user.id)
    .run(connection, (err, result) => {
     if (err) throw err
     if(result === null) return connection.close()
     const money = result.Cash
     let newMoney = money + 5
     rethink.db('Discord').table('economy')
     .get(user.id)
     .update({"Cash": newMoney})
     .run(connection, err => {
         if (err) throw err
         connection.close()
     })
  })
}
  setTimeout(addMoney, 5000)
  setTimeout(removeIDFromArray, 5000);
}

exports.bankUpdate = async () => {
  const connection = await rethink.connect()
  rethink.db("Discord").table("economy")
    .update({"Bank": rethink.round(rethink.row("Bank").mul(1.01))})
    .run(connection, err => {
      if (err) throw err
    })

}
