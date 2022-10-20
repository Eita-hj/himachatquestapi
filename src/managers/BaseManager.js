const Cache = require("../structures/Cache");

module.exports = class BaseManager {
	constructor(client){
		this.client = client;
		this.cache = new Cache();
	};
};
