const { api, convtext } = require("../utils/");

module.exports = async function (client, defaultbmark) {
	let first = true
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
					result.place = await client.users.get(Number(n.aite))
					result.author = await client.users.get(Number(n.uid));
					result.createdTimeStamp = Number(n.htime) * 1000
					result.createdAt = new Date(result.createdTimestamp)
					if (
						source.startsWith(
							"<a href='javascript:void(0);' class='astyle' onclick='PhotoGet(this,"
						)
					) {
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
						//const photoData = await api.post(api.links.Attachment.PhotoData(pid, pkey, tag),{}, 2).then(n => n.stream())
						//result.file = new DirectMessageAttachMent(client, photoData, pid)
					} else {
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
					result.reply = result.author.send
					if (!client.secret.chatload) return;
					client.emit("DirectMessageCreate", result);
				}
			}	
		} else {
			bmark = data.bmark || bmark;
			first = false;
		}
		if (!client.secret.chatload) return;
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}
