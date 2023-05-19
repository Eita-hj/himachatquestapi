const BaseMessageManager = require("./BaseMessageManager")
module.exports = class DirectMessageManager extends BaseMessageManager {
	constructor(client, user) {
		super(client)
		this.user = user
	}
}
