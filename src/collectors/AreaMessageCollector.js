const { api, convtext } = require("../utils/");

module.exports = async function (client, defaultbmark = 0) {
	if (!client.secret.recieves.has(1n << 0n)) return;
	let first = defaultbmark !== 0
	let { bmark } = await api.post(api.links.Chat.AreaMessage, {
		marumie: client.secret.id,
		seskey: client.secret.key,
		bmark: defaultbmark,
	});
	for (; client.secret.chatload;) {
		if (!client.secret.chatload) return;
		const data = await api.post(api.links.Chat.AreaMessage, {
			marumie: client.secret.id,
			seskey: client.secret.key,
			bmark,
		});
		if (!client.secret.chatload) return;
		const comments = data.coments.filter(n => n.type === "c")
		if (comments.length) {
			if (!first){
				for (let i = 0; i < comments.length; i++) {
					bmark = data.bmark || bmark;
					const { source } = comments[i];
					const result = new Object();
					result.authorId = comments[i].uid
					if (client.secret.ignoreUsers.includes(result.authorId)) continue;
					result.content = source
						.split("\t")
						.join("")
						.split("<td class='c_mozi' style='color:#000000'>")[1]
						.split("\n")[0]
					result.shout = result.content.includes("<b style=")
					result.content = convtext(result.content)
					result.content = result.shout ? result.content.slice(25).slice(0, -4) : result.content
					if (!client.secret.chatload) return;
					result.author = await client.users.get(result.authorId);
					if (!client.secret.chatload) return;
					client.emit("AreaMessageCreate", result);
				}
			} else {
				bmark = data.bmark || bmark;
				first = false;
			}
		}
		if (!client.secret.chatload) return;
		await new Promise((resolve) => setTimeout(resolve, client.secret.postInterval));
	}
}
