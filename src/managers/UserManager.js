const BaseManager = require("./BaseManager")
const { api, convtext } = require("../utils/")
const User = require("../structures/User")
const ClientUser = require("../structures/ClientUser")

module.exports = class UserManager extends BaseManager {
	async fetch(id) {
		if (isNaN(id)) throw new Error(`${id} is invalid. (Error Code 500)`)
		if (!(typeof Number(id) === "number" && Number.isInteger(Number(id)) && id > 0)) throw new Error(`${id} is invalid. (Error Code 501)`)
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
		if (source.source != "このアカウントは利用停止されています"){
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
			if (result.guild.name == "<span style='color:#AAAAAA;font-size:14px;'>(未設定)</span>") result.guild = undefined
			if (id == this.client.secret.id) {
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
			result.profile = "利用停止されたアカウントです。"
			result.lastlogin = new Date(0)
			result.ip = ip.source.split("\r\n")[2].split("\t").join("").split("<br />").join("")
		}
		if (this.client.secret.options.has(1n << 2n)) {
			if (this.cache.has(result.id)) this.cache.delete(result.id);
			this.cache.set(result.id, result);
		}
		if (id == this.client.secret.id) return new ClientUser(result, this.client)
		return new User(result, this.client);
	}
	async get(id) {
		return this.cache.has(id) ? this.cache.get(id) : await this.fetch(id);
	}
}
