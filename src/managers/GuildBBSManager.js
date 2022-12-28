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
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
			targetid: this.guild.id,
			page,
		})
		const { source } = f
		const a = source.split("<div class='gw_bbsul' onclick='BBSWindow(")
		a.shift()
		const r = []
		for (let i = 0; i < a.length; i++){
			const n = a[i]
			const id = n.split(",1)'>")[0]
			const count = n.split("<small class='gw_bbsul_many'>(")[1].split(")</small>")[0]
			const lastUpdateTimestamp = Date.parse(n.split("<small class='gw_bbsul_updated'>")[1].split("</small>")[0].split("-").join("/"))
			const lastUpdateAt = new Date(lastUpdateTimestamp)
			if (this.client.secret.option.has(1n << 3n)){
				const data = await this.client.BBSs.fetch(id)
				data.save({lastUpdateTimestamp, lastUpdateAt, count})
				if (this.client.secret.caches.has(1n << 2n)) this.cache.set(id, data.clone())
				r.push([id, data.clone()])
			} else {
				const title = n.split("<span class='gw_bbsul_title'>")[1].split("</span>")[0]
				const data = {
					id,
					title,
					count,
					lastUpdateAt,
					lastUpdateTimestamp
				}
				const BBS = new GuildBBS(r, this.client)
				if (this.client.secret.caches.has(1n << 2n)) this.cache.set(id, BBS)
				r.push([id, BBS])
			}
		}
		return new Cache(r)
	}
}
