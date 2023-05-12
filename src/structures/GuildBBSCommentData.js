const {api, convtext} = require("../utils/")
const Data = require("./Data")
module.exports = class GuildBBSCommentData extends Data {
  constructor(a, b){
    super(a, b)
  }
  delete() {
    api.post(api.links.Guild.BBS.CommentDelete, {
      origin: "himaque",
      myid: this.client.secret.id,
      seskey: this.client.secret.key,
      bbstxtid: this.commentid
    })
  }
}
