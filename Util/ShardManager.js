const {ShardingManager} = require('discord.js');
const token = require("../config/config.json")
const economy = require('./economy.js')
const Manager = new ShardingManager('./app.js',
                                                  {
                                                  "totalShards": "auto",
                                                  "respawn": true,
                                                  "token": token.BotToken
                                                  });
//spawn shards
Manager.spawn();
//Bank Update
setInterval(economy.bankUpdate, 7200000)

Manager.on('launch', shard => {
    console.log(`Shard spawned with ID ${shard.id}`)
})

//when the shard sends a message with process.send, this will get it.
Manager.on("message", (Shard, message) => {
  console.log("[TO MANAGER]:", require("util").inspect(message));
  if (!message.b)
    Shard.send("Welcome! -manager");
  else
    Shard.send({
            "obj": "hi all",
            "b": message.b
          });
})
