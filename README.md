# 使い方
## ログイン
```js
const { HCQ: Client, OptionBits, LoginType } = require("himaque-api")
const hcq = new HCQ({
	option: [
		OptionBits.Flags.GuildMessage,
		OptionBits.Flags.UserCache,
		OptionBits.Flags.GuildCache
	]
})

hcq.on("ready", () => {
	console.log("ready!")
})

hcq.login(LoginType.IdPass, "ID", "PASS")
```
## ギルチャ受信・送信
※ログインするアカウントがギルドに参加している必要があります。
```js
hcq.on("GuildMessageCreate", message => {
	if (message.author.id === hcq.user.id) return;
	if (message.content === "ping"){
		hcq.guild.send("pong!");
	}
	if (message.content === "hello"){
		hcq.guild.send(`Hello! ${message.author.name}`)
	}
})

```

## ユーザー情報取得
```js
hcq.on("GuildMessageCreate", async message => {
	if (message.author.id === hcq.user.id) returnl
	if (message.type !== "text") return;
	//example: "!user 16762"
	if (message.content.startsWith("!user")){
		const id = message.content.slice(6)
		if (isNaN(id)) return
		const user = await hcq.users.fetch(Number(id))
		console.log(user)
	}
})
```

## ギルド情報取得
```js
hcq.on("reqdy", async () => {
	//No.1046 ミナコイギルド
	const guild = await hcq.guilds.fetch(1046)
	console.log(guild)
})
