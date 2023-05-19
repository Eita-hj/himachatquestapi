const BaseMessage = require("./BaseMessage")
const { api } = require("../utils/")

module.exports = class GuildMessage extends BaseMessage {
	reply(content) {
		if (typeof content === "string") {
			this.guild.send(content)
		}
	}
}
