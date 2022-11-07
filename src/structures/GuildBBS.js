const {api, convtext} = require("../utils/")
const Data = require("./Data")
const GuildBBSCommentManager = require("../managers/GuildBBSCommentManager")

module.exports = class GuildBBS extends Data {
  constructor(a, b, c){
    super(a, b)
    if (!c) this.delete = null
    this.comments = new GuildBBSCommentManager(this.client, this)
  }
}
