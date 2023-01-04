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
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
      bbsid: this.BBS.id,
      page
    })
    const { source } = f
    const a = source.split("<small onclick='UserWindow(")
    a.shift()
    const r = []
    for (let i = 0; i < a.length; i++){
      const n = a[i]
      const authorid = n.split(")")[0]
      const author = await this.client.users.get(Number(authorid))
      const number = Number(n.split(">")[1].split("　")[0])
      const createdTimestamp = Date.parse(n.split("<span style='color:#AAAAAA'>")[1].split("</span>")[0].split("-").join("/"))
      const createdAt = new Date(createdTimestamp)
      const content = convtext(n.split("<p class='bbsul_honbun'>")[1].split("</p>")[0].split("<br />\n").join("\n"))
      const files = n.includes("<img class='photoimg' src='PhotoBBS/") ? n.split("<div class='bbsul_imgdivs'>")[1].split("<img class='photoimg' src='PhotoBBS/").slice(1).map(n => `http://himaquest.com/PhotoBBS/${n.split("'")[0]}`) : null
      const commentData = new GuildBBSCommentData({number, content, files, author, createdAt, createdTimestamp}, this.client)
      r.push([number, commentData])
      if (this.client.secret.caches.has(1n << 3n)) this.cache.set(number, commentData)
    }
    return new Cache(r)
  }
}
