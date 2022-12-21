const BaseManager = require("./BaseManager")
const User = require("../structures/User")
const Cache = require("../structures/Cache")
const { api, convtext } = require("../utils/")

class ClientUserIgnoreManager extends BaseManager {
	async fetch() {
		const { musiarray } = await api.post(api.links.User.Ignores.List,{
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
		})
		const result = new Cache()
		for (let i = 0; i < musiarray.length; i++){
			const u = await this.client.users.get(musiarray[i])
			result.set(musiarray[i], u)
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
		} else {
			if (!Number(Number(target)).isSafeInteger()) throw new TypeError(`${target} is invalid.`)
			await api.post(api.links.User.Ignores.Add,{
				marumie: this.client.secret.id,
				seskey: this.client.secret.key,
				tuid: target
			})
		}
		if (this.client.secret.caches.has(1n << 5n)) await this.fetch()
		return
	}
	async remove(target) {
		if (target instanceof User){
			await api.post(api.links.User.Ignores.Remove,{
				marumie: this.client.secret.id,
				seskey: this.client.secret.key,
				targetid: target.id
			})
		} else {
			if (!Number(Number(target)).isSafeInteger()) throw new TypeError(`${target} is invalid.`)
			const r = await api.post(api.links.User.Ignores.Remove,{
				marumie: this.client.secret.id,
				seskey: this.client.secret.key,
				targetid: target
			})
		}
		if (this.client.secret.caches.has(1n << 5n)) await this.fetch()
		return
	}
}

module.exports = ClientUserIgnoreManager
