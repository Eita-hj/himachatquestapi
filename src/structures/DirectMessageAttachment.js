const BaseFileAttachment = require("./BaseFileAttachment")

module.exports = class DirectMessageAttachMent extends BaseFileAttachment {
	constructor(client, file, targetid, id){
		super(client, file, id)
		if (!client || !file) return
		this.data.append("ftype", "photosubmih")
		this.data.append("targetid", `${targetid}`)
	}
}
