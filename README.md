# 使い方
```
const { HCQ: Client, OptionBits } = require("himaque-api")
const hcq = new HCQ({
  option: [
    OptionBits.Flags.GuildMessage
  ]
})

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

hcq.login("ID","PASS")
```
