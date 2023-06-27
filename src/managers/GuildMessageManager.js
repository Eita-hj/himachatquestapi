const BaseMessageManager = require("./BaseMessageManager")
module.exports = class GuildMessageManager extends BaseMessageManager {
	constructor(client, guild) {
		super(client)
		this.guild = guild
	}
}
