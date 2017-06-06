let   moment                                = require('moment');
const recentlyUpdated                       = [];
const rethink                               = require('rethinkdb')

module.exports = async function(oldMember, newMember)
{
  if (recentlyUpdated.includes(newMember.id)) return;
  recentlyUpdated.push(oldMember.id);
  function removeIDFromArray()
  {
    recentlyUpdated.splice(recentlyUpdated.indexOf(oldMember.id), 1)
  }
if(newMember.presence.status  === "online" && oldMember.presence.status === "offline")
{
  const connection = await rethink.connect()
  rethink.db('Discord').table('OnlineTime')
        .insert(
        {
          "id": `${newMember.id}`,
          "time": `${moment().unix()}`
        },
        {"conflict": "replace"}
      )
      .run(connection, err => {
        if (err) throw err
        connection.close()
      })
}else if(oldMember.presence.status  === "online" && newMember.presence.status === "offline")
{
  const connection = await rethink.connect()
  rethink.db('Discord').table('OnlineTime')
  .get(`${oldMember.user.id}`)
  .delete()
  .run(connection, err => {
    if (err) throw err
    connection.close()
  })
}
 setTimeout(removeIDFromArray, 3000);
}
