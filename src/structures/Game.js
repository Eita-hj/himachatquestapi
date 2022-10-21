const { api, convtext } = require("../utils/");
const Cache = require("./Cache")

module.exports = class Game {
	constructor(client) {
		this.ranking = new Ranking(client);
		this.updateInfo = new UpdateInfo()
	}
}

class Ranking {
	constructor(client) {
		this.client = client
	}
	async get(ranking, cache = true) {
		let result = new Cache(),
			temp = new Array();
		let source = await api.post(api.links.Ranking);
		source = source.source
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
			obj.user = this.client?.secret?.id
				? cache
					? this.client.secret.options.has(1n << 2n)
						? this.client.users.fetch(id)
						: this.client.users.get(id)
					: await this.client.fetch(id)
				: {
						name: convtext(temp[2].split("<small style='color:#AAAAAA'>")[0]),
						id: id,
					};
			obj.mission = temp[3];
			obj.date = temp[4].split("</td></tr>")[0];
			result.set(temp[0], obj);
		}
		if (ranking) {
			return result.get(ranking.toString());
		}
		return result;
	}
}

class UpdateInfo {
	async get(date = null) {
		let results = "",
			result = new Map(),
			temp = new Array();
		await api.post(api.links.UpdateInfo).source;
		results = results
			.split("<BR>")
			.join("<br>")
			.slice(33)
			.slice(0, -12)
			.split("<br>\r\n");
		for (let i = results.length - 1; i >= 0; i--) {
			if (
				/^[0-9]{4}\/([1-9]|1[0-2])\/([1-9]|[12][0-9]|3[01])/.test(
					results[i].trim()
				)
			) {
				result.set(results[i], temp);
				temp = new Array();
			} else {
				temp.unshift(results[i]);
			}
			if (date) {
				if (typeof date == "string") {
					return result.get(date);
				} else {
					return result.get(
						`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
					);
				}
			}
			return result;
		}
	}
}
