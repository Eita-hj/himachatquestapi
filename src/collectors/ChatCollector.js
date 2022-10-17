const { api, convtext } = require("../utils/");

let load = false
const startload = function (client, kbmark) {
	if (client.user.guild?.id && client.secret.options.has(1n << 1n)) getGuildChat(client);
	if (client.secret.options.has(1n << 0n)) getAreaChat(client, kbmark)
	client.on("debug", (debug) => {
		if (debug == "[Debug] Logout Requested."){
			return load = false
		}
	})
};

async function getGuildChat(client) {
	load = true
	let bmark = await api.post(api.links.Guild.ChatEntry, {
		marumie: client.secret.id,
		seskey: client.secret.key,
	});
	bmark = bmark.bmark
	for (let rate = 1; true; rate++) {
		if (!load) return;
		const obj = await api.post(api.links.Chat.GuildMessage, {
			marumie: client.secret.id,
			seskey: client.secret.key,
			bmark,
			rate,
		});
		if (!load) return;
		const result = new Object();
		result.client = client;
		result.guild = client.user.guild;
		if (!!obj.coments[0]) {
			bmark = obj.bmark || bmark;
			let c = obj.coments[0].source;
		if (!load) return;
			result.author = client.secret.options.has(1n << 2n) ? await client.users.get(obj.coments[0].uid) : await client.users.fetch(obj.coments[0].uid);
			if (
				c.includes(
					"<a href='javascript:void(0);' class='astyle' onclick='PhotoGet(this,"
				)
			) {
				result.type = "image";
				let pid = c.split("PhotoGet(this,")[1];
				let pkey = pid.split(',"')[1].split('")')[0];
				pid = pid.split(",")[0];
				if (!load) return;
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
				const { GuildMessageAttachMent } = require("../structures/FileAttachent")
				const photoData = await api.post(api.links.Attachment.PhotoData(pid, pkey, tag),{}, 2).then(n => n.stream())
				console.log(photoData)
				result.file = new GuildMessageAttachMent(client, photoData, pid)
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
			if (!load) return;
			client.emit("GuildMessageCreate", result);
			client.emit("GuildMessage", result);
		}
		if (!load) return;
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}

async function getAreaChat(client, defaultbmark) {
	load = true
	let first = true
	let bmark = await api.post(api.links.Chat.AreaMessage, {
		marumie: client.secret.id,
		seskey: client.secret.key,
		bmark: defaultbmark,
	}).bmark;
	for (; load; ) {
		if (!load) return;
		const data = await api.post(api.links.Chat.AreaMessage, {
			marumie: client.secret.id,
			seskey: client.secret.key,
			bmark,
		});
		if (!!data.coments[0]) {
			if (!first){
				for (let i = 0; i < data.coments.length; i++) {
					bmark = data.bmark == undefined ? bmark : data.bmark;
					let source = data.coments[i].source;
					let result = new Object();
					result.content = source
						.split("\t")
						.join("")
						.split("<td class='c_mozi' style='color:#000000'>")[1]
						.split("\n")[0]
					result.shout = result.content.includes("<b style=")
					result.content = convtext(result.content)
					result.content = result.shout ? result.content.slice(25).slice(0, -4) : result.content
					if (!load) return;
					result.content
					result.author = client.secret.options.has(1n << 2n)
						? await client.users.fetch(data.coments[i].uid)
						: await client.users.get(data.coments[i].uid);
					if (!load) return;
					client.emit("AreaMessageCreate", result);
					client.emit("AreaMessage", result);
				}
			} else {
				bmark = data.bmark == undefined ? bmark : data.bmark;
				first = false;
			}
		}
		if (!load) return;
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}
exports.startload = startload;
