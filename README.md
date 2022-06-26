# [HIMACHAT QUEST](http://himaquest.com)用

## 使い方
```
const {Client: HCQ} = require("himaque-API")
const hcq = new HCQ()

hcq.login("ヒマクエのID","ヒマクエのPASS")

hcq.on("ready", () => {
  console.log("ready!")
})

hcq.on("guildMessage", message => {
  if (message.content === "ping"){
    hcq.guild.send("pong!")
  }
})
```
