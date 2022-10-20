const BaseFileAttachment = require("./BaseFileAttachment")

module.exports = class GuildMessageAttachment extends BaseFileAttachment {
	constructor(client, file, id){
		super(client, file, id)
		if (!client || !file) return
		this.data.append("ftype", "photosubmir")
	}
}
