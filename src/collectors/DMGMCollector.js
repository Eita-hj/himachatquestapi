  for (;client.secret.chatload;){
    if (!client.secret.chatload) return;
    //http://ksg-network.tokyo/F5KSG.php
    const d = await api.post(api.links.Chat.Check.DMGM, {
      origin: "himaque",
      myid: client.secret.id,
      seskey: client.secret.key,
      bmark: bmarks.ksg
    })
    if (d.cmds.length){
      if (client.secret.options.has(1n << 0n) && d.cmds.find(n => n.type === "c_h")){
        const data = await api.post(api.links.Chat.Recieve.Direct, {
          origin: "himaque",
          myid: client.secret.id,
          seskey: client.secret.key
        })
        bmarks.direct = data.bmark
        for (let i = data.msgs.length; i > 0; i--){
          const n = data.msgs[i - 1]
          if ((!client.secret.recieves.has(1n << 0n) && n.type == 0) || (!client.secret.recieves.has(1n << 1n) && n.type == 7)) continue
          const msg = {}
          msg.authorid = n.userid
          msg.author = await client.users.get(n.userid)
          msg.content = n.type == 0 ? n.mozi : ""
          msg.createdTimestamp = Date.parse(`${new Date().getFullYear()}/${n.hiduke}`)
          msg.createdAt = new Date(msg.createdTimestamp)
          msg.type = n.type == 0 ? "text" : "image"
          msg.file = n.type == 7 ? {url: n.mozi.split(":")[2], id: n.mozi.split(":")[0]} : {}
          msg.at = await client.users.get(n.targetid)
          client.emit("DirectMessageCreate", msg)
        }
      }
      if (client.secret.options.has(1n << 2n) && d.cmds.find(n => n.type === "c_g")) {
        const data = await api.post(api.links.Chat.Recieve.Guild, {
          origin: "himaque",
          myid: client.secret.id,
          seskey: client.secret.key,
          bmark: bmarks.guild
        })
        bmarks.guild = data.bmark
        for (let i = data.msgs.length; i > 0; i--){
          const n = data.msgs[i - 1]
          if (n.type == 1) {
            if (!client.secret.recieves.has(1n << 2n)) continue
            const d = {}
            d.userid = n.userid
