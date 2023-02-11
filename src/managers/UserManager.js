const BaseManager = require("./BaseManager")
const { api, convtext } = require("../utils/")
const User = require("../structures/User")
const ClientUser = require("../structures/ClientUser")
const Cache = require("../structures/Cache")

module.exports = class UserManager extends BaseManager {
	constructor(client){
		super(client)
		if (!client.secret.caches.has(1n << 0n)) delete this.cache
	}
	async exists(id){
		if (isNaN(id)) throw new Error(`${id} is invalid. (Error Code 500)`)
		if (!(typeof Number(id) === "number" && Number.isInteger(Number(id)) && Number(id) > 0)) throw new Error(`${id} is invalid. (Error Code 501)`)
		const data = await api.post(api.links.User.Manage, {
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
			targetid: id
		})
		return (data !== "いません")
	}
	async fetch(data) {
		switch (typeof data){
			case "number":
			case "string":
				const id = String(data)
				if (isNaN(data)) throw new Error(`${data} is invalid. (Error Code 500)`)
				if (!(typeof Number(data) === "number" && Number.isInteger(Number(data)) && Number(data) > 0)) throw new Error(`${data} is invalid. (Error Code 501)`)
				const ip = await api.post(api.links.User.Manage, {
					marumie: this.client.secret.id,
					seskey: this.client.secret.key,
					targetid: id
				})
				if (ip == "いません") return undefined
				const source = await api.post(api.links.User.Info, {
					marumie: this.client.secret.id,
					seskey: this.client.secret.key,
					targetid: id,
				});
				const result = new Object();
				if (source.source != "このアカウントは利用停止されています" && !source.source.includes("<div>拒否されました</div>")){
					result.id = id;
					result.name = convtext(
						source.source.split(".png' />")[1].split("</div>")[0]
					);
					result.rank = Number(
						source.source.split("='rankicon' src='picts/Rank")[1].split(".png")[0]
					);
					result.profile = convtext(
						source.source
							.split("<div class='profile_shoukai'>")[1]
							.split("</div>")[0]
							.split("<br />")
							.join("")
					);
					result.lastlogin = new Date(
						source.source
							.split("<div class='profile_updated'>最終ログイン")[1]
							.split("</div>")[0]
					);
					result.guild = {
						name: convtext(source.source.split("<span style='color:#AAAAAA;font-size:8px;vertical-align:super;float:left;'>所属</span>\r\n")[1].split("</div>")[0].split(/\s/).join(""))
					}
					if (result.guild.name == "<spanstyle='color:#AAAAAA;font-size:14px;'>(未設定)</span>") result.guild = undefined
					if (data == this.client.secret.id) {
						let guildid = await api.post(api.links.User.JoinGuilds, {
							marumie: this.client.secret.id,
							seskey: this.client.secret.key,
						});
						guildid = guildid.myguild;
						result.guild =
							guildid == 0 ? null : await this.client.guilds.fetch(guildid);
					}
					result.ip = ip.source.split("\r\n")[2].split("\t").join("").split("<br />").join("")
				} else {
					result.name = ip.source.split("<h3>")[1].split("</h3>")[0]
					result.id = id
					result.rank = null
					result.profile = source.source.includes("<div>拒否されました</div>") ? "blocked" : "deleted"
					result.lastlogin = new Date(0)
					result.ip = ip.source.split("\r\n")[2].split("\t").join("").split("<br />").join("")
				}
				let user = new User(result, this.client);
				if (id === this.client.secret.id) return new ClientUser(result, this.client)
				if (this.client.secret.options.has(1n << 2n)) {
					if (this.cache.has(result.id)) this.cache.delete(result.id);
					this.cache.set(result.id, user);
				};
				return user;
				break;
			case "object":
				const cache = new Cache()
				if (Array.isArray(data)){
					for (let i = 0; i < data.length; i++){
						const id = data[i]
						if (typeof id === "number" || typeof id === "string"){
							const user = await this.fetch(id)
							cache.set(string(id), user)
						} else {
							throw new TypeError(`${id} must be string, or number.`)
						}
					}
					return cache;
				} else {
					throw new TypeError(`${data} must be array<string | number>, string, or number.`)
				}
			default:
				throw new TypeError(`${data} must be array<string | number>, string, or number.`)
		}
		
	}
	get(data) {
		switch (typeof data){
			case "number":
			case "string":
				return this.cache?.has?.(String(data)) ? this.cache.get(String(data)) : this.fetch(String(data));
				break;
			case "object":
				const cache = new Cache()
				if (Array.isArray(data)){
					for (let i = 0; i < data.length; i++){
						const id = data[i]
						if (typeof id === "number" || typeof id === "string"){
							const user = this.get(String(id))
							cache.set(string(id), user)
						} else {
							throw new TypeError(`${id} must be string, or number.`)
						}
					}
					return cache;
				} else {
					throw new TypeError(`${data} must be array<string | number>, string, or number.`)
				}
			default:
				throw new TypeError(`${data} must be array<string | number>, string, or number.`)
		}
	}
}
