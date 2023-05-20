const Data = require("./Data")
const { api } = require("../utils/")
const DirectMessageManager = require("../managers/DirectMessageManager")

module.exports = class User extends Data {
	constructor(a, b){
		super(a, b)
		if (this.id != this.client.secret.id){
			this.messages = new DirectMessageManager(this.client, this)
			this.save(this.messages)
		}
	}
	async send(data){
		const DirectMessageAttachment = require("./DirectMessageAttachment")
		if (data instanceof DirectMessageAttachment){
			await api.post(api.links.Attachment.Upload.DM, data.data, this.id, 1)
		} else {
			if (!(typeof data == "string" || typeof data == "number"))
				throw new Error("Message type Error(Error Code 300)");
			if (String(data.length) > 150)
				throw new Error("Message length Error(Error Code 301)");
			if (!data) throw new Error("Cannot send Empty message(Error Code 302)");
			if (this.id === this.client.user.id) throw new Error("Message target Error(Error Code 304)")
			await api.post(api.links.User.SendDM, {
				origin: "himaque",
				myid: this.client.secret.id,
				seskey: this.client.secret.key,
				monku: data.split("\n").join(" "),
				target: this.id
			})
		}
		return;
	}
	async fetch(){
		const result = await this.client.users.fetch(this.id)
		return result
	}
	async reload(){
		const result = await this.fetch(this.id)
		for (const n in result){
			this[n] = result[n]
		}
		this.save(result)
		return this
	}
	toString() {
		return `${this.name} (No.${this.id})`
	}
}
