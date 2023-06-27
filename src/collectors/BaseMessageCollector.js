const { api, convtext } = require("../utils/");
exports.startload = function (client, kbmark = 0, hbmark = 0) {
	const DMGM = require("./DMGMCollector");
	const AreaMessage = require("./AreaMessageCollector")
	if (
		client.secret.options.has(1n << 0n) ||
		client.secret.options.has(1n << 1n) ||
		(client.user.guild && client.secret.options.has(1n << 2n))
	){
		client.secret.chatload = true;
	} else {
		return;
	}
	if (client.secret.options.has(1n << 0n) || (client.user.guild && client.secret.options.has(1n << 2n))) DMGM(client)
	if (client.secret.options.has(1n << 1n)) AreaMessage(client, kbmark);
};
