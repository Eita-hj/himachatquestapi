const { api, convtext } = require("../utils/");

let load = false
exports.startload = function (client, kbmark, hbmark) {
	const GuildMessage = require("./GuildMessageCollector")
	const AreaMessage = require("./AreaMessageCollector")
	const DirectMessage = require("./DirectMessageCollector")
	if (client.user.guild?.id && client.secret.options.has(1n << 1n)) GuildMessage(client);
	if (client.secret.options.has(1n << 0n)) AreaMessage(client, kbmark)
	if (client.secret.options.has(1n << 4n)) DirectMessage(client, hbmark)
};
