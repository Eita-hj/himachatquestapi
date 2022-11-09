const {api, convtext} = require("../utils/")
const Cache = require("../structures/Cache")
const BaseManager = require("./BaseManager")
module.exports = class GuildBBSManager extends BaseManager {
  constructor(client, guild){
    super(client)
    this.guild = guild
  }
  async fetch(page){
    if (!typeof page === "number") throw new TypeError(`${page} is invalid.`)
    const f = await api.post(api.links.Guild.BBS.List, {
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
      targetid: this.guild.id,
      page,
    })
    const { source } = f
    const a = source.split("<div class='gw_bbsul' onclick='BBSWindow(")
    a.shift()
    for (let i = 0; i < a.length; i++){
      const n = a[i]
      const id = n.split(",1)'>")[0]
      const data = await this.client.BBSs.fetch(id)
      const count = n.split("<small class='gw_bbsul_many'>(")[1].split(")</small>")[0]
      const lastUpdateTimestamp = Date.parse(n.split("<small class='gw_bbsul_updated'>(")[1].split(")</small>")[0].split("-").join("/"))
      const lastUpdate = new Date(lastUpdateTimestamp)
      data.save({lastUpdateTimestamp, lastUpdate, count})
      //if (this.client.secret.options.has(1 << 5)) this.cache.set(id, data.clone())
      r.push([id, data.clone()])
    })
    return new Cache(r)
  }
}
