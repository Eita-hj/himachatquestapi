const { EventEmitter } = require("node:events");
module.exports = class BaseClient extends EventEmitter {
	constructor(options){
		super();
		if (typeof options !== "object") throw new TypeError(`ClietOption is invalid.`)
	};
};
