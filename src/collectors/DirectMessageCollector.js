const { api, convtext } = require("../utils/");

module.exports = async function (client, defaultbmark = 0) {
	let first = defaultbmark !== 0
	let { bmark } = await api.post(api.links.Chat.DirectMessage, {
		marumie: client.secret.id,
		seskey: client.secret.key,
		bmark: defaultbmark,
	});
	for (; client.secret.chatload; ) {
		if (!client.secret.chatload) return;
		const data = await api.post(api.links.Chat.DirectMessage, {
			marumie: client.secret.id,
			seskey: client.secret.key,
			bmark,
		});
		if (!first) {
			if (data.coments.length){
				bmark = data.bmark || bmark;
				for (let i = 0; i < data.coments.length; i++) {
					const n = data.coments[i]
					const { source } = n;
					const result = new Object();
					result.authorId = data.coments[i].uid
					result.place = await client.users.get(Number(n.aite))
					result.author = await client.users.get(result.authorId);
					result.createdTimeStamp = Number(n.htime) * 1000
					result.createdAt = new Date(result.createdTimestamp)
					if (
						source.includes(
							"<a href='javascript:void(0);' class='astyle' onclick='PhotoGet(this,"
						)
					) {
						if (!client.secret.recieves.has(1n << 1n)) continue;
						result.type = "image";
						let pid = source.split("PhotoGet(this,")[1];
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
						result.file = new DirectMessageAttachMent(client, api.links.Attachment.PhotoData(pid, pkey, tag), pid)
					} else {
						if (!client.secret.recieves.has(1n << 0n)) continue;
						result.type = "text";
						result.file = null;
						result.content = convtext(
							source
								.split("\t")
								.join("")
								.split("<td class='c_mozi' style='color:#000000'>")[1]
								.split("\n")[0]
						);
					}
					result.reply = (c) => result.author.send(c)
					if (!client.secret.chatload) return;
					client.emit("DirectMessageCreate", result);
				}
			}	
		} else {
			bmark = data.bmark || bmark;
			first = false;
		}
		if (!client.secret.chatload) return;
		await new Promise((resolve) => setTimeout(resolve, client.secret.postInterval));
	}
}
