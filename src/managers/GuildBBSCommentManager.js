const {api, convtext} = require("../utils/")
const BaseManager = require("./BaseManager")
const GuildBBSCommentData = require("../structures/GuildBBSCommentData")
const Cache = require("../structures/Cache")
module.exports = class GuildBBSCommentManager extends BaseManager {
  constructor(client, data){
    super(client)
    if (!client.secret.caches.has(1n << 3n)) delete this.cache
    this.BBS = data
  }
  async fetch(page){
    if (!(typeof Number(page) === "number" && Number.isInteger(Number(page)) && Number(page) > 0)) throw new TypeError(`${page} is invalid.`)
    const f = await api.post(api.links.Guild.BBS.Window, {
      origin: "himaque",
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
      bbsid: this.BBS.id,
      page
    })
    const { bbstxts } = f
    const { client } = this
    const r = []
    for (let i = 0; i < bbstxts.length; i++){
      const n = bbstxts[i]
      const d = {}
      d.authorid = n.userid
      d.author = await this.client.users.get(Number(d.authorid))
      d.number = Number(n.bangou)
      d.commentid = n.bbstxtid
      d.createdTimestamp = Date.parse(n.created.split("-").join("/"))
      d.createdAt = new Date(d.createdTimestamp)
      d.content = n.naiyou
      d.files = n.imgfiles.map(m => ({url: `http://ksg-network.tokyo/photo/${m.filename}`}))
      const commentData = new GuildBBSCommentData(d, this.client)
      r.push([number, commentData])
      if (this.client.secret.caches.has(1n << 3n)) this.cache.set(number, commentData)
    }
    return new Cache(r)
  }
}
