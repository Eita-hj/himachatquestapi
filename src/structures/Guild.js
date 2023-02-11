const Data = require("./Data")
const { api } = require("../utils/")
const GuildBBSManager = require("../managers/GuildBBSManager")

module.exports = class Guild extends Data {
	constructor(a,b){
		super(a,b)
		this.BBSs = new GuildBBSManager(this.client, this)
	}
	async send(data) {
		console.log(this)
		if (this.id !== this.client.user.guild.id) throw new Error("Message guild Error(Error Code 303)")
		const GuildMessageAttachment = require("./GuildMessageAttachment")
		if (data instanceof GuildMessageAttachment){
			await api.post(api.links.Attachment.Upload.Guild, data.data, 1)
		} else {
			if (!(typeof data == "string" || typeof data == "number"))
				throw new Error("Message type Error(Error Code 300)");
			if (String(data.length) > 150)
				throw new Error("Message length Error(Error Code 301)");
			if (!data) throw new Error("Cannot send Empty message(Error Code 302)");
			await api.post(api.links.Guild.SendMessage, {
				marumie: this.client.secret.id,
				seskey: this.client.secret.key,
				monku: data.split("\n").join(" ")
			});
		}
		return;
	}
	async reload(){
		const data = await this.fetch(this.id)
		for (const n in data){
			this[n] = data[n]
		}
		this.save(data)
		return this
	}
	async fetch(){
		const data = await this.client.guilds.fetch(this.id)
		return data
	}
}
