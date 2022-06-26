# [HIMACHAT QUEST](http://himaquest.com)用

## 使い方
```
const HCQ = require("himaque-api").Client
const hcq = new HCQ()

hcq.login("ヒマクエのID","ヒマクエのPASS")

hcq.on("ready", () => {
  console.log("ready!")
})

hcq.on("guildMessageCreate", message => {
  if (message.author.id === hcq.user.id) return;
  if (message.content === "ping"){
    hcq.guild.send("pong!");
  }
  if (message.content === hello){
    hcq.guild.send(`Hello! ${hcq.user.name}`)
  }
})
```
