const BaseManager = require("./BaseManager");
const { api, convtext } = require("../utils/");
const Cache = require("../structures/Cache");
const FriendRequestUser = require("../structures/FriendRequestUser");

module.exports = class ClientUserFriendRequestsManager extends BaseManager {
	constructor(client){
		super(client)
		if (!client.secret.caches.has(1n << 4n)) delete this.cache
	}
	async fetch() {
		const { sinseidata } = await api.post(api.links.User.Friends.List, {
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
		});
		const users = sinseidata.map((user) => ({
			id: user.sinseisha,
			requestId: user.sinseiid,
			recieved: user.updated,
		}));
		const data = new Cache();
		for (let i = 0; i < users.length; i++) {
			const userdata = users[i];
			const user = await this.client.users.get(userdata.id);
			const recievedTimestamp = Date.parse(
				userdata.recieved.split("-").join("/")
			);
			const recievedAt = new Date(recievedTimestamp);
			user.save({
				recievedTimestamp,
				recievedAt,
				requestId: userdata.requestId,
			});
			const requestuser = new FriendRequestUser(user.getData(), this.client);
			if (this.client.secret.caches.has(1n << 4n)) data.set(user.id, requestuser);
		}
		return data;
	}
	async allow(data) {
		const requestId = data instanceof FriendRequestUser ? data.requestId : data;
		if (!requestId || !Number.isSafeInteger(Number(requestId)))
			throw new TypeError(
				"FriendRequestAllowData must be requestIdResolvable."
			);
		await api.post(api.links.User.FriendRequests.Allow, {
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
			sinseiid: requestId,
		});
		if (this.client.secret.caches.has(1n << 4n)){
			const userId = data?.id ?? this.cache.find(n => n.requestId === requestId)?.id ?? 0
			if (!userId) return
			const user = await this.client.users.get(userId)
			this.cache.delete(userId)
			return user
		}
	}
	async deny(data) {
		const requestId = data instanceof FriendRequestUser ? data.requestId : data;
		if (!requestId || !Number.isSafeInteger(Number(requestId)))
			throw new TypeError("FriendRequestDenyData must be requestIdResolvable.");
		await api.post(api.links.User.FriendRequests.Deny, {
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
			sinseiid: requestId,
		});
		if (this.client.secret.caches.has(1n << 4n)){
			const userId = data?.id ?? this.cache.find(n => n.requestId === requestId)?.id ?? 0
			if (!userId) return
			const user = await this.client.users.get(userId)
			this.cache.delete(userId)
			return user
		}
	}
}
