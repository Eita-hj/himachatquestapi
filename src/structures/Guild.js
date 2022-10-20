const Data = require("./Data")
const { api } = require("../utils/")

module.exports = class Guild extends Data {
	async send(data) {
		if (this.id !== this.client.user.guild.id) throw new Error("Message guild Error(Error Code 303)")
		const { GuildMessageAttachMent } = require("./FileAttachent")
		console.log(data.constructor.name)
		if (data.constructor.name instanceof GuildMessageAttachMent){
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
	async resolve(){
		const data = await this.client.guilds.fetch(this.id)
		for (const n in data){
			this[n] = data[n]
		}
		this.save(data)
		return this
	}
}
