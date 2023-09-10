const {api, convtext} = require("../utils/")
const Cache = require("../structures/Cache")
const BaseManager = require("./BaseManager")
const GuildBBS = require("../structures/GuildBBS")

module.exports = class GuildMembersManager extends BaseManager {
	constructor(client, guild){
		super(client)
		if (!client.secret.caches.has(1n << 8n)) delete this.cache
		this.guild = guild
	}
	async fetch(page){
		if (!typeof page === "number") throw new TypeError(`${page} is invalid.`);
		const f = await api.post(api.links.Guild.Members, {
			origin: "himaque",
			myid: this.client.secret.id,
			seskey: this.client.secret.key,
			gid: this.guild.id,
			page
		});
		const { members } = f;
		const r = [];
		for (let i = 0; i < members.length; i++){
			const n = members[i];
			const d = await this.client.users.get(n.userid);
			const role = {
				"0": "member",
				"80": "healper",
				"90": "subadmin",
				"99": "admin"
			}
			d.save({
				lastLoginTimestamp: Date.parse(n.updated.split("-").join("/")),
				lastLoginedAt: new Date(d.lastLoginTimestamp),
				role: role[n.shokui]
			});
			const u = r.clone();
			r.push([n.userid, u]);
			if (this.client.secret.options.has(1n << 8n)) this.cache.set(id, u);
		}
		return new Cache(r)
	}
}
