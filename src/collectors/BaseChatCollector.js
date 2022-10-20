const { api, convtext } = require("../utils/");

let load = false
exports.startload = function (client, kbmark) {
	const GuildChat = require("./GuildChatCollector")
	const AreaChat = require("./AreaChatCollector")
	if (client.user.guild?.id && client.secret.options.has(1n << 1n)) GuildChat(client);
	if (client.secret.options.has(1n << 0n)) AreaChat(client, kbmark)
};
