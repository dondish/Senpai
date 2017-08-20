const rethink = require('rethinkdb')

const recentlyUpdated = [];

exports.messageUpdate = member => {
  if (recentlyUpdated.includes(member.id)) return;
  recentlyUpdated.push(member.id);
  function removeIDFromArray()
  {
    recentlyUpdated.splice(recentlyUpdated.indexOf(member.id), 1)
  }
  async function addMoney() {
  const connection = await rethink.connect()
  rethink.db('Discord').table('money')
    .get(`${member.id}${member.guild.id}`)
    .run(connection, (err, result) => {
     if (err) throw err
     if(result === null) return connection.close()
     const money = result.cash
     let newMoney = money + 5
     rethink.db('Discord').table('money')
     .get(`${member.id}${member.guild.id}`)
     .update({"cash": newMoney})
     .run(connection, err => {
         if (err) throw err
         connection.close()
     })
  })
}
  setTimeout(addMoney, 5000)
  setTimeout(removeIDFromArray, 30000);
}


exports.bankUpdate = async () => {
    const connection = await rethink.connect()
    rethink.db("Discord").table("money")
        .update({"bank": rethink.round(rethink.row("Bank").mul(1.01))})
        .run(connection, err => {
            if (err) throw err
        })
}
