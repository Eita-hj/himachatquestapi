# 使い方
```
const HCQ = require("himaque-api").Client
const hcq = new HCQ()

hcq.login("ID","PASS")

hcq.on("ready", () => {
  console.log("ready!")
})

hcq.on("GuildMessageCreate", message => {
  if (message.author.id === hcq.user.id) return;
  if (message.content === "ping"){
    hcq.guild.send("pong!");
  }
  if (message.content === hello){
    hcq.guild.send(`Hello! ${message.author.name}`)
  }
})
```
