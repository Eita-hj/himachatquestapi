const BaseManager = require("./BaseManager")
const { api, convtext } = require("../utils/")
const Guild = require("../structures/Guild")

module.exports = class GuildManager extends BaseManager {
	constructor(client){
		super(client)
		if (!client.secret.caches.has(1n << 1n)) delete this.cache
	}
	async exists(id){
		if (isNaN(data)) throw new Error(`${data} is invalid. (Error Code 500)`)
		if (!(typeof Number(data) === "number" && Number.isInteger(Number(data)) && Number(data) > 0)) throw new Error(`${data} is invalid. (Error Code 501)`)
		const { source } = await api.post(api.links.Guild.Info, {
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
			targetid: id,
		});
		const name = convtext(
			source
				.split("<div class='gw_guildname'>")[1]
				.split("</div>")[0]
		);
		return (name !== "")
	}
	async fetch(data) {
		switch (typeof data){
			case "number":
			case "string":
				if (isNaN(data)) throw new Error(`${data} is invalid. (Error Code 500)`)
				if (!(typeof Number(data) === "number" && Number.isInteger(Number(data)) && Number(data) > 0)) throw new Error(`${data} is invalid. (Error Code 501)`)
				const { source } = await api.post(api.links.Guild.Info, {
					marumie: this.client.secret.id,
					seskey: this.client.secret.key,
					targetid: data,
				});
				const result = new Object();
				result.id = String(data);
				result.name = convtext(
					source
						.split("<div class='gw_guildname'>")[1]
						.split("</div>")[0]
				);
				if (result.name == "") return null
				result.PR = convtext(source.split("<div class='gw_guildpr'>")[1].split("</div>")[0]);
				result.info = convtext(
					source
						.split("<div class='gw_setumei'>")[1]
						.split("</div>")[0]
						.split("<br />")
						.join("\n")
				);
				result.ownerID = source
					.split("<span onclick='UserWindow(")[1]
					.split(")")[0];
				result.owner = result.ownerID == this.client.secret.id ? this.user : await this.client.users.get(result.ownerID)
				const guild = new Guild(result, this.client);
				if (this.client.secret.options.has(1n << 2n)) {
					if (this.cache.has(result.id)) this.cache.delete(result.id);
					this.cache.set(result.id, guild);
				}
				return guild
			case "object":
				const cache = new Cache()
				if (Array.isArray(data)){
					for (let i = 0; i < data.length; i++){
						const id = data[i]
						if (typeof id === "number" || typeof id === "string"){
							const guild = await this.fetch(id)
							cache.set(string(id), guild)
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
	get(data){
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
							const guild = this.get(String(id))
							cache.set(string(id), guild)
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
