const { api, convtext } = require("../utils/");
const Cache = require("../structures/Cache");
const BaseManager = require("./BaseManager")
module.exports = class RankingManager extends BaseManager {
	async fetch(ranking) {
		let result = new Cache(),
			temp = new Array();
		let { source } = await api.post(api.links.Ranking);
		source = source
			.split("<BR>")
			.join("<br>")
			.split("\t")
			.join("")
			.split("\r\n")
			.join("")
			.split("<tr><td>");
		source.shift();
		for (let i = 0; i < source.length; i++) {
			temp = source[i].split("</td><td>");
			const obj = new Object();
			const id = Number(
				temp[2].split("<small style='color:#AAAAAA'>")[1].split("</small>")[0]
			);
			obj.user = this.client
				? this.client.users.get(id)
				: {
						name: convtext(temp[2].split("<small style='color:#AAAAAA'>")[0]),
						id: id,
					};
			obj.mission = temp[3];
			obj.date = temp[4].split("</td></tr>")[0];
			result.set(temp[0], obj);
		}
		if (this.client){
			if (this.client.secret.caches.has(33n)) this.cache = result.clone()
		}
		if (ranking) return result.get(ranking.toString());
		return result;
	}
	async get(ranking){
		if (ranking){
			return this.cache.size ? this.cache : (await this.fetch())
		} else {
			return this.cache.has(ranking) ? this.cache.get(ranking) : (await this.fetch(ranking))
		}
	}
}
