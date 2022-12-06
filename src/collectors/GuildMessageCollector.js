const { api, convtext } = require("../utils/");

module.exports = async function (client) {
	let bmark = await api.post(api.links.Guild.ChatEntry, {
		marumie: client.secret.id,
		seskey: client.secret.key,
	});
	bmark = bmark.bmark
	for (let rate = 1; true; rate++) {
		if (!client.secret.chatload) return;
		const obj = await api.post(api.links.Chat.GuildMessage, {
			marumie: client.secret.id,
			seskey: client.secret.key,
			bmark,
			rate,
		});
		if (!client.secret.chatload) return;
		const result = new Object();
		result.client = client;
		result.guild = client.user.guild;
		if (obj.coments.length) {
			bmark = obj.bmark || bmark;
			for (let i = 0; i < obj.coments.length; i++){
				let c = obj.coments[i].source;
				if (!client.secret.chatload) return;
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
					const GuildMessageAttachMent = require("../structures/GuildMessageAttachment")
					//const photoData = await api.post(api.links.Attachment.PhotoData(pid, pkey, tag),{}, 2).then(n => n.stream())
					result.file = new GuildMessageAttachMent(client, api.links.Attachment.PhotoData(pid, pkey, tag), pid)
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
			}
			if (!client.secret.chatload) return;
			client.emit("GuildMessageCreate", result);
		}
		if (!client.secret.chatload) return;
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}
