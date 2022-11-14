const { api, convtext } = require("../utils/");

module.exports = async function (client, defaultbmark) {
	let first = true
	let bmark = await api.post(api.links.Chat.DirectMessage, {
		marumie: client.secret.id,
		seskey: client.secret.key,
		bmark: defaultbmark,
	}).bmark;
	for (; client.secret.chatload; ) {
		if (!client.secret.chatload) return;
		const data = await api.post(api.links.Chat.DirectMessage, {
			marumie: client.secret.id,
			seskey: client.secret.key,
			bmark,
		});
		if (!first) {
			if (data.coments.length){
				for (let i = 0; i < data.coments.length; i++) {
					bmark = data.bmark || bmark;
					let source = data.coments[i].source;
					let result = new Object();
					result.content = source
						.split("\t")
						.join("")
						.split("<td class='c_mozi' style='color:#000000'>")[1]
						.split("\n")[0]
					result.author = client.secret.options.has(1n << 2n) ? await client.users.get(obj.coments[i].uid) : await client.users.fetch(obj.coments[i].uid);
					if (
						c.includes(
							"<a href='javascript:void(0);' class='astyle' onclick='PhotoGet(this,"
						)
					) {
						result.type = "image";
						let pid = c.split("PhotoGet(this,")[1];
						let pkey = pid.split(',"')[1].split('")')[0];
						pid = pid.split(",")[0];
						if (!client.secret.chatload) return;
						let tag = await api.post(api.links.Attachment.PhotoGet, {
							marumie: client.secret.id,
							seskey: client.secret.key,
							imgid: pid,
							imgpass: pkey,
						})
						tag = tag.source
						if (tag.includes(".png")) {
							tag = ".png";
						} else if (tag.includes(".jpg")) {
							tag = ".jpg";
						} else if (tag.includes(".gif")) {
							tag = ".gif";
						} else if (tag.includes(".jpeg")) {
							tag = ".jpeg";
						}
						result.content = null;
						const DirectMessageAttachMent = require("../structures/DirectMessageAttachment")
						const photoData = await api.post(api.links.Attachment.PhotoData(pid, pkey, tag),{}, 2).then(n => n.stream())
						result.file = new DirectMessageAttachMent(client, photoData, pid)
					} else {
						result.type = "text";
						result.file = null;
						c = convtext(
							c
								.split("\t")
								.join("")
								.split("<td class='c_mozi' style='color:#000000'>")[1]
								.split("\n")[0]
						);
						result.content = c
					}
					result.reply = result.author.send
					if (!client.secret.chatload) return;
					client.emit("DirectMessageCreate", result);
				}
			} else {
				bmark = data.bmark == undefined ? bmark : data.bmark;
				first = false;
			}
		}
		if (!client.secret.chatload) return;
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}
