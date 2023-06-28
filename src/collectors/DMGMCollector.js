const { api, convtext } = require("../utils/")
const id = {
  direct: 0,
  guild: 0
}
const DirectMessage = require("../structures/DirectMessage")
const GuildMessage = require("../structures/GuildMessage")
module.exports = async function (client){
  client.secret.bmarks = {
    guild: -1,
    direct: 0,
    ksg: 0
  }
  if (client.secret.options.has(1n << 0n)) {
    const {bmark} = await api.post(api.links.Chat.Check.Direct, {
      origin: "himaque",
      myid: client.secret.id,
      seskey: client.secret.key
    })
    client.secret.bmarks.direct = bmark
  }
  if (client.secret.options.has(1n << 2n)) {
    const {bmark} = await api.post(api.links.Chat.Recieve.Guild, {
      origin: "himaque",
      myid: client.secret.id,
      seskey: client.secret.key,
      bmark: -1
    })
    client.secret.bmarks.guild = bmark
  }
  await api.post(api.links.Chat.Check.DMGM, {
      origin: "himaque",
      myid: client.secret.id,
      seskey: client.secret.key,
      bmark: client.secret.bmarks.ksg
  }).then(n => {
    if (n.cmds.length){
      client.secret.bmarks.ksg = n.cmds.at(-1).bmark
    }
  })
  console.log(client.secret.bmarks)
  for (;client.secret.chatload;){
    if (!client.secret.chatload) return
    const d = await api.post(api.links.Chat.Check.DMGM, {
      origin: "himaque",
      myid: client.secret.id,
      seskey: client.secret.key,
      bmark: client.secret.bmarks.ksg
    })
    if (d.cmds.length){
      console.log(client.secret.bmarks)
      client.secret.bmarks.ksg = d.cmds.at(-1).bmark
      if (client.secret.options.has(1n << 0n) && d.cmds.find(n => n.type === "c_h")){
        const data = await api.post(api.links.Chat.Recieve.Direct, {
          origin: "himaque",
          myid: client.secret.id,
          seskey: client.secret.key,
          bmark: client.secret.bmarks.direct
        })
        client.secret.bmarks.direct = data.bmark
        for (let i = data.msgs.length; i > 0; i--){
          const n = data.msgs[i - 1]
          if (Number(n.msgid) < Number(id.direct)) continue;
          if ((!client.secret.recieves.has(1n << 0n) && n.type == 0) || (!client.secret.recieves.has(1n << 1n) && n.type == 7)) continue
          const msg = {}
          msg.id = n.msgid
          id.direct = msg.id
          msg.authorid = n.userid
          msg.author = await client.users.get(n.userid)
          msg.content = (n.type == 0) ? convtext(n.mozi) : ""
          msg.createdTimestamp = Date.parse(`${new Date().getFullYear()}/${n.hiduke}`)
          msg.createdAt = new Date(msg.createdTimestamp)
          msg.type = (n.type == 0) ? "text" : "image"
          msg.file = (n.type == 7) ? {url: `http://ksg-network.tokyo/photo/${n.mozi.split(":")[2]}`, id: n.mozi.split(":")[0]} : {}
          msg.at = await client.users.get(n[n.userid === client.user.id ? "targetid" : "userid"])
          const message = new DirectMessage(msg, client)
          if (client.secret.caches.has(1n << 7n)) msg.at.messages.cache.set(message.id, message)
          client.emit("DirectMessageCreate", message)
        }
      }
      if (client.secret.options.has(1n << 2n) && d.cmds.find(n => n.type === "c_g")) {
        const data = await api.post(api.links.Chat.Recieve.Guild, {
          origin: "himaque",
          myid: client.secret.id,
          seskey: client.secret.key,
          bmark: client.secret.bmarks.guild
        })
        client.secret.bmarks.guild = data.bmark
        for (let i = data.msgs.length; i > 0; i--){
          const n = data.msgs[i - 1]
          if (Number(n.msgid) < Number(id.guild)) continue;
          if (n.type == 1) {
            if (!client.secret.recieves.has(1n << 2n)) continue
            const d = {}
            d.userid = n.userid
            d.user = await client.users.get(d.userid)
            d.guild = client.guild
            d.createdTimestamp = Date.parse(`${new Date().getFullYear()}/${n.hiduke}`)
            d.createdAt = new Date(d.createdTimestamp)
            client.emit("GuildDungeonCreate", d)
          } else {
            if ((!client.secret.recieves.has(1n << 0n) && n.type == 0) || (!client.secret.recieves.has(1n << 1n) && n.type == 7)) continue
            const msg = {}
            msg.id = n.msgid
            id.guild = msg.id
            msg.authorid = n.userid
            msg.author = await client.users.get(n.userid)
            msg.content = (n.type == 0) ? convtext(n.mozi) : ""
            msg.type = (n.type == 0) ? "text" : "image"
            msg.file = (n.type == 7) ? {url: `http://ksg-network.tokyo/photo/${n.mozi.split(":")[2]}`, id: n.mozi.split(":")[0]} : {}
            msg.createdTimestamp = Date.parse(`${new Date().getFullYear()}/${n.hiduke}`)
            msg.createdAt = new Date(msg.createdTimestamp)
            msg.guild = client.guild
            const message = new GuildMessage(msg, client)
            if (client.secret.caches.has(1n << 7n)) msg.guild.messages.cache.set(message.id, message)
            client.emit("GuildMessageCreate", message)
          }
        }
      }
    }
  }
}
