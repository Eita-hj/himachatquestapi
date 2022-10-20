# 使い方

## ギルチャ受信&返信
※ログインするアカウントがギルドに参加している必要があります。
```
const { HCQ: Client } = require("himaque-api")
const hcq = new HCQ()

hcq.on("ready", () => {
  console.log("ready!")
})

hcq.on("GuildMessageCreate", message => {
  if (message.author.id === hcq.user.id) return;
  if (message.content === "ping"){
    hcq.guild.send("pong!");
  }
  if (message.content === "hello"){
    hcq.guild.send(`Hello! ${message.author.name}`)
  }
})

hcq.login("ID","PASS")
```
