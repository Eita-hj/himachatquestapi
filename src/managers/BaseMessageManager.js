const BaseManager = require("./BaseManager")
const BaseMessage = require("../structures/BaseMessage")
module.exports = class BaseMessageManager extends BaseManager {
	constructor(client) {
		super(client)
		if (client.secrets.caches.has(1n << 7n)) delete this.cache
	}
	resolve(data) {
		if (typeof data === "string" || typeof data === "number") {
			return this.cache.get(data)
		} else if (data instanceof BaseMessage) {
			return this.resolve(data?.id)
		}
		return undefined
	}
	resolveId(data) {
		return this.resolve(data)?.id
	}
}
