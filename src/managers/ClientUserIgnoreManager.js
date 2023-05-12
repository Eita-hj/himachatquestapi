const BaseManager = require("./BaseManager")
const User = require("../structures/User")
const Cache = require("../structures/Cache")
const { api, convtext } = require("../utils/")

class ClientUserIgnoreManager extends BaseManager {
	constructor(client){
		super(client)
		if (!client.secret.caches.has(1n << 4n)) delete this.cache
	}
	async fetch() {
		const { musilist } = await api.post(api.links.User.Ignores.List,{
			myid: this.client.secret.id,
			seskey: this.client.secret.key,
		})
		const result = new Cache()
		for (let i = 0; i < musilist.length; i++){
			const n = musilist[i]
			const r = {}
			r.userid = n.tuid
			r.user = await this.client.users.get(n.tuid)
			r.ip = n.remote
			r.createdTimeStamp = Date.parse(n.created.split("-").join("/"))
			r.createdAt = new Date(r.createdTimeStamp)
			result.set(r.userid, r)
		}
		if (this.client.secret.caches.has(1n << 5n)) this.cache = result
		return result
	}
	async add(target) {
		if (target instanceof User){
			await api.post(api.links.User.Ignores.Add,{
				marumie: this.client.secret.id,
				seskey: this.client.secret.key,
				tuid: target.id,
				tmemo: target.name
			})
			this.client.secret.ignoreUsers.push(Number(target.id))
		} else {
			if (!Number.isSafeInteger(Number(target))) throw new TypeError(`${target} is invalid.`)
			await api.post(api.links.User.Ignores.Add,{
				marumie: this.client.secret.id,
				seskey: this.client.secret.key,
				tuid: target
			})
			this.client.secret.ignoreUsers.push(String(target))
		}
		if (this.client.secret.caches.has(1n << 5n)) await this.fetch()
		return
	}
	async remove(target) {
		if (target instanceof User){
			await api.post(api.links.User.Ignores.Remove,{
				myid: this.client.secret.id,
				seskey: this.client.secret.key,
				target: target.id
			})
			this.client.secret.ignoreUsers.filter(n => n != target.id)
		} else {
			if (!Number.isSafeInteger(Number(target))) throw new TypeError(`${target} is invalid.`)
			const r = await api.post(api.links.User.Ignores.Remove,{
				myid: this.client.secret.id,
				seskey: this.client.secret.key,
				target: target
			})
			this.client.secret.ignoreUsers = this.client.secret.ignoreUsers.filter(n => n !== String(target))
		}
		if (this.client.secret.caches.has(1n << 5n)) await this.fetch()
		return
	}
}

module.exports = ClientUserIgnoreManager
