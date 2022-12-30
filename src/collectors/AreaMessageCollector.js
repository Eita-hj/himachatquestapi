const { api, convtext } = require("../utils/");

module.exports = async function (client, defaultbmark) {
	if (!client.secret.recieves.has(1n << 0n)) return;
	let first = true
	let bmark = await api.post(api.links.Chat.AreaMessage, {
		marumie: client.secret.id,
		seskey: client.secret.key,
		bmark: defaultbmark,
	}).bmark;
	for (; client.secret.chatload; ) {
		if (!client.secret.chatload) return;
		const data = await api.post(api.links.Chat.AreaMessage, {
			marumie: client.secret.id,
			seskey: client.secret.key,
			bmark,
		});
		if (data.coments.length) {
			if (!first){
				for (let i = 0; i < data.coments.length; i++) {
					bmark = data.bmark == undefined ? bmark : data.bmark;
					let source = data.coments[i].source;
					let result = new Object();
					result.authorId = data.coments[i].uid
					if (client.secret.ignoreUsers.includes(Number(result.authorId))) continue;
					result.content = source
						.split("\t")
						.join("")
						.split("<td class='c_mozi' style='color:#000000'>")[1]
						.split("\n")[0]
					result.shout = result.content.includes("<b style=")
					result.content = convtext(result.content)
					result.content = result.shout ? result.content.slice(25).slice(0, -4) : result.content
					if (!client.secret.chatload) return;
					result.author = client.secret.options.has(1n << 2n)
						? await client.users.fetch(result.authorId)
						: await client.users.get(result.authorId);
					if (!client.secret.chatload) return;
					client.emit("AreaMessageCreate", result);
				}
			} else {
				bmark = data.bmark == undefined ? bmark : data.bmark;
				first = false;
			}
		}
		if (!client.secret.chatload) return;
		await new Promise((resolve) => setTimeout(resolve, client.secret.postInterval));
	}
}
