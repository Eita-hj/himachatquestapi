const Data = require("./Data")
const { api } = require("../utils/")

module.exports = class BaseMessage extends Data {
	toString() {
		return `${this.author} ${this.content}`
	}
}
