const { api, convtext } = require("../utils/");
const Cache = require("../structures/Cache");
const BaseClient = require("./BaseClient")
const RankingManager = require("../managers/RankingManager")

module.exports = class GameClient extends BaseClient {
	constructor(options) {
		super()
		const { client, userFetch } = options
		if (userFetch) {
			this.ranking = new RankingManager(client);
		} else {
			this.ranking = new RankingManager();
		}
	}
	async getUpdateInfo(date = null) {
		let result = new Cache(),
			temp = new Array();
		const { source } = await api.post(api.links.UpdateInfo);
		const results = source
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
};
