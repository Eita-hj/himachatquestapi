const {api, convtext} = require("../utils/")
const Data = require("./Data")
const GuildBBSCommentManager = require("../managers/GuildBBSCommentManager")

module.exports = class GuildBBS extends Data {
	constructor(a, b, c){
		super(a, b)
		if (!c) this.delete = null
		this.comments = new GuildBBSCommentManager(this.client, this)
	}
	async send(data){
		if (!data) throw new TypeError("Cannot send empty message")
		if (typeof data === "string"){
			await api.post(api.links.Guild.BBS.Send, {
				marumie: this.client.secret.id,
				seskey: this.client.secret.key,
				fnaiyou: data,
				imgarray: [],
				bbsid: this.id
			})
		}
	}
}
