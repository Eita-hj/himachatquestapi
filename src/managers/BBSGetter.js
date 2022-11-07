const {api, convtext} = require("../utils/")
const BaseManager = require("./BaseManager")
const GuildBBSCommentManager = require("./GuildBBSCommentManager")
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
    if (f === "メンバーでない" || f.error === 99) return null
    const r = {}
    const { source } = f
    f.id = id
    r.title = convtext(source.split("<h3 style='font-weight:bold' class='bbsul_title'>")[1].split("</h3>")[0])
    const authorid = source.split("author <span onclick='UserWindow(")[1].split(")")[0]
    r.author = await this.client.users.get(Number(authorid))
    const t = source.split(`style='color:#0000EE;cursor:pointer;font-size:11px;'>${authorid}</span>　`)[1].split("</div>")[0]
    r.createdTimestamp = Date.parse(t.split("-").join("/"))
    r.createdAt = new Date(r.createdTimestamp)
    r.comments = new GuildBBSCommentManager(this.client, this)
    return new GuildBBS(r, this.client)
  }
}
