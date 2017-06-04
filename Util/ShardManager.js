const { ShardingManager } = require('discord.js');
const token = require("../config/config.json")
const Manager = new ShardingManager('./app.js',
                                                {
                                                  "totalShards": "auto",
                                                  "respawn": true,
                                                  "token": token.BotToken
                                                });

// spawn shards
Manager.spawn();

Manager.on('launch', shard => {
    console.log(`Shard spawned with ID ${shard.id}`)
})

// when the shard sends a message with process.send, this will get it.
Manager.on("message", (a, m) => {
  console.log("[TO MANAGER]:", require("util").inspect(m));
  if (!m.b)
    a.send("Welcome! -manager");
  else
    a.send({obj: "hi all", b: m.b});
})
