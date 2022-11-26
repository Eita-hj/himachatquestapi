const BaseManager = require("./BaseManager")
const { api, convtext } = require("../utils/")
const Guild = require("../structures/Guild")

module.exports = class GuildManager extends BaseManager {
	async fetch(id) {
		if (isNaN(id)) throw new Error(`${id} is invalid. (Error Code 500)`)
		if (!(typeof Number(id) === "number" && Number.isInteger(Number(id)) && id > 0)) throw new Error(`${id} is invalid. (Error Code 501)`)
		let source = await api.post(api.links.Guild.Info, {
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
			targetid: id,
		});
		source = source.source;
		const result = new Object();
		result.id = id;
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
		if (this.client.secret.options.has(1n << 2n)) {
			if (this.cache.has(result.id)) this.cache.delete(result.id);
			this.cache.set(result.id, result);
		}
		return new Guild(result, this.client);
	}
}
