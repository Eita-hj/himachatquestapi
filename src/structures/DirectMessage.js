const BaseMessage = require("./BaseMessage")
const { api } = require("../utils/")

module.exports = class DirectMessage extends BaseMessage {
	reply(content) {
		if (typeof content === "string") {
			this.author.send(content)
		}
	}
}
