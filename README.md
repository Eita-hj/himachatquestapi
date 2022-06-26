# [HIMACHAT QUEST](http://himaquest.com)用

## 使い方
```
const {Client: hcq} = require("himaque-API")
hcq.login("ヒマクエのID","ヒマクエのPASS")

hcq.on("ready", () => {
  console.log("ready!")
})

hcq.on("guildMessage", message => {
  if (message.content === "ping"){
    hcq.user.guild.send("pong!")
  }
})
```
