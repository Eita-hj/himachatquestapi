const {api, convtext} = require("../utils/")
const BaseManager = require("./BaseManager")
const Cache = require("../structures/Cache")
module.exports = class GuildBBSCommentManager extends BaseManager {
  constructor(client, data){
    super(client)
    this.BBS = data
  }
  async fetch(page){
    if (!typeof page === "number") throw new TypeError(`${page} is invalid.`)
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
      const author = await this.client.users.fetch(Number(authorid))
      const number = Number(n.split(">")[1].split("　")[0])
      const createdTimestamp = Date.parse(n.split("<span style='color:#AAAAAA'>")[1].split("</span>")[0].split("-").join("/"))
      const createdAt = new Date(createdTimestamp)
      const content = convtext(n.split("<p class='bbsul_honbun'>")[1].split("</p>")[0].split("<br />\n").join("\n"))
      r.push([number, new GuildBBSCommentData({number, content, author, createdAt, createdTimestamp}, this.client)])
    }
    return new Cache(r)
  }
}
