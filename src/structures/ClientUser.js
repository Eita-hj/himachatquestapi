const User = require("./User")
const { api } = require("../utils/")
module.exports = class ClientUser extends User {
	async setUserName(name){
		if (typeof name !== "string") throw new Error("User name must be string.")
		if (name.length > 10) throw new Error("User name length must be 10 or smaller.")
		await api.post(api.links.User.Setting.NameChange, {
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
			fname: name
		})
		this.name = name
		return this
	}
	async setProfile(profile){
		if (typeof profile !== "string") throw new Error("User profile must be string.")
		if (profile.length > 150) throw new Error("User name length must be 150 or smaller.")
		await api.post(api.links.User.Setting.ProfileChange, {
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
			shoukai: profile
		})
		this.profile = profile
		return this
	}
}
