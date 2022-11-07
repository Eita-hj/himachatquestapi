const {api, convtext} = require("../utils/")
const BaseManager = require("./BaseManager")
const GuildBBS = require("../structures/GuildBBS")

module.exports = class BBSGetter extends BaseManager {
  constructor(client){
    super(client)
  }
  async fetch(id){
    if (!typeof id === "number") throw new TypeError(`${id} is invalid.`)
    const f = await api.post(api.links.Guild.BBS.Window, {
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
      bbsid: id,
      page: 1
    })
    const r = {}
    const { source } = f
    r.title = convtext(source.split("<h3 style='font-weight:bold' class='bbsul_title'>")[1].split("</h3>")[0])
    r.author = await this.client.users.get(Number(source.split("author <span onclick='UserWindow(")[1].split(")")))
    const t = source.split.split("</span>")
    r.createdTimestamp = Date.parse(t[t.length - 1].slice(1).slice(0, -6).split("-").join("/"))
    r.createdAt = new Date(createdTimestamp)
    r.comments = new GuildBBSCommentManager(this)
    return new GuildBBS(r, this.client)
  }
}
