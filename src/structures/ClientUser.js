const User = require("./User")
const { api } = require("../utils/")
module.exports = class ClientUser extends User {
	async setUserName(name){
		await api.post(api.links.User.Setting.NameChange, {
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
			fname: name
		})
		this.name = name
		return this
	}
	async setProfile(profile){
		await api.post(api.links.User.Setting.ProfileChange, {
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
			shoukai: profile
		})
		this.profile = profile
		return this
	}
}
