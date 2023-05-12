const {api, convtext} = require("../utils/")
const Cache = require("../structures/Cache")
const BaseManager = require("./BaseManager")
const GuildBBS = require("../structures/GuildBBS")

module.exports = class GuildBBSManager extends BaseManager {
	constructor(client, guild){
		super(client)
		if (!client.secret.caches.has(1n << 2n)) delete this.cache
		this.guild = guild
	}
	async fetch(page){
		if (!typeof page === "number") throw new TypeError(`${page} is invalid.`)
		const f = await api.post(api.links.Guild.BBS.List, {
			origin: "himaque",
			myid: this.client.secret.id,
			seskey: this.client.secret.key,
			gid: this.guild.id,
			page,
		})
		const { bbss } = f
		const r = []
		for (let i = 0; i < a.length; i++){
			const n = bbss[i]
			const d = {}
			d.id = n.bbsid
			d.count = n.many
			d.lastUpdateTimestamp = Date.parse(n.updated.split("-").join("/"))
			d.lastUpdateAt = new Date(s.lastUpdateTimestamp)
			if (this.client.secret.options.has(1n << 3n)){
				const data = await this.client.BBSs.fetch(id)
				data.save({lastUpdateTimestamp: d.lastUpdateTimestamp, lastUpdateAt: d.lastUpdateAt, count: d.count})
				if (this.client.secret.caches.has(1n << 2n)) this.cache.set(id, data.clone())
				r.push([d.id, data.clone()])
			} else {
				d.title = n.title
				const BBS = new GuildBBS(d, this.client)
				if (this.client.secret.caches.has(1n << 2n)) this.cache.set(d.id, BBS)
				r.push([d.id, BBS])
			}
		}
		return new Cache(r)
	}
}
