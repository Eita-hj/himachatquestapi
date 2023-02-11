const BaseClient = require("./BaseClient");
const ClientOptionBits = require("../structures/ClientOptionBits")
const ClientCacheOptionBits = require("../structures/ClientCacheOptionBits")
const ClientRecieveOptionBits = require("../structures/ClientRecieveOptionBits")
const { api } = require("../utils/")
const { GenerateToken: { toData, toToken } } = require("../utils/");

module.exports = class Client extends BaseClient {
	constructor(ClientOptions) {
		if (ClientOptions.options == undefined) throw new Error("ClientOptionBits must be set.");
		super(ClientOptions);
		const options = ClientOptionBits.set(ClientOptions.options);
		const recieves = ClientRecieveOptionBits.set(ClientOptions.recieves ?? [...Object.values(ClientRecieveOptionBits.Flags)]);
		if (ClientOptions.recieves && !options.hasAny(7n) && recieves?.bits !== 0n)
			throw new Error(`ClientOptionBits must be included any message option to set ClientRecieveOptionBits.`);
		const caches = ClientCacheOptionBits.set(ClientOptions.caches ?? [...Object.values(ClientCacheOptionBits.Flags)]);
		const ignoreUsers = (ClientOptions.ignoreUsers || []).map(userid => String(userid));
		if (!Array.isArray(ignoreUsers)) throw new TypeError("ClientOption.ignoreUsers must be Array.");
		const postInterval = ClientOptions.postInterval || 1000;
		if (typeof postInterval !== "number") throw new Error(`${postInterval} is invaled.\nClientOption.postInterval must be number.`);
		if (!Number.isSafeInteger(postInterval) || postInterval < 100 || postInterval > 600000)
			throw new TypeError(`${postInterval} is invalid.\nClientOption.postInterval must be 100(ms) to 600000(ms)`);
		this.id = "";
		this.pass = "";
		this.users = require("../managers/UserManager");
		this.guilds = require("../managers/GuildManager");
		this.BBSs = require("../managers/BBSGetter");
		this.ignores = require("../managers/ClientUserIgnoreManager")
		this.friends = require("../managers/ClientUserFriendsManager")
		this.addons = {}
		this.games = require("./GameClient");
		this.secret = {
			id: undefined,
			key: undefined,
			options,
			recieves,
			caches,
			ignoreUsers,
			postInterval,
			logined: false,
			chatload: false
		};
	}
	async login(type, data1, data2){
		switch (type){
			case "IDPASS":
			case "IDPass":
			case "IdPass":
			case 0:
				await this.loginByIdPass(data1, data2);
				break;
			case "Data":
			case "SIDSKEY":
			case 1:
				await this.loginByData(data1, data2);
				break;
			case "TOKEN":
			case "token":
			case "Token":
			case 2:
				await this.loginByToken(data1)
				break;
			default:
				throw new TypeError("Login Type is invalid.")
		}
	}
	async loginByIdPass(id = this.id, pass = this.pass) {
		if (this.secret.logined) throw new Error("Already Logined.")
		this.emit("debug", "[Debug] Login Requested.")
		this.emit("debug", `[Debug] Recieved ID: ${id.slice(0,2)}${id.slice(2).replace(/./g, "*")} Recieved Pass: ${pass.slice(0,2)}${pass.slice(2).replace(/./g, "*")}`)
		if (!id || !pass) throw new Error("ID or PASS is invalid.(Error Code 100)");
		if (!id.match(/^[a-z0-9]{4,20}$/) || !pass.match(/^[a-z0-9]{4,20}$/))
			return new Error("ID or PASS is invalid.(Error Code 101)");
		const result = await api.post(api.links.Login, {
			fid: id,
			fpass: pass,
			hkey: 1,
		});
		if (result.error == 2) {
			throw new Error("ID or PASS is wrong. (Error Code 102)");
		} else if (result.error == 404) {
			throw new Error("ERROR 404 (Banned.)");
		} else {
			this.secret.logined = true
			this.secret.id = result.userid;
			this.secret.key = result.seskey;
			this.guilds = new this.guilds(this);
			this.users = new this.users(this);
			this.ignores = new this.ignores(this);
			this.friends = new this.friends(this);
			this.BBSs = new this.BBSs(this);
			this.user = await this.users.fetch(result.userid);
			this.guild = this.user.guild;
			this.secret.logined = true
			const { startload } = require("../collectors/BaseMessageCollector");
			this.token = toToken({ID: id, Pass: pass, SID: this.secret.id, SKEY: this.secret.key})
			this.games = new this.games({
				client: this,
				userFetch: true
			})
			const ignores = await this.ignores.fetch()
			ignores.map(n => this.secret.ignoreUsers.push(n.id))
			this.emit("ready", this);
			startload(this, result.kbmark, result.hbmark);
			return true;
		}
	}
	async loginByData(SID, SKEY){
		if (this.secret.logined) throw new Error("Already Logined.")
		this.emit("debug", "[Debug] Login Requested.")
		this.emit("debug", `[Debug] Recieved SID: ${SID} Recieved SKEY: ${(`${SKEY}`).slice(0,4)}${(`${SKEY}`).slice(4).replace(/./g, "*")}`)
		
		if (!SID || !SKEY) throw new TypeError("SID or SKEY is invaild.")
		const result = await api.post(api.links.User.Info, {
			marumie: SID,
			seskey: SKEY,
			targetid: SID
		})
		if (result === "セッション不正") throw new Error("SID or SKEY is invalid.")
		this.secret.logined = true
		this.secret.id = SID;
		this.secret.key = SKEY;
		this.guilds = new this.guilds(this);
		this.users = new this.users(this);
		this.ignores = new this.ignores(this);
		this.friends = new this.friends(this);
		this.BBSs = new this.BBSs(this);
		this.user = await this.users.fetch(SID);
		this.guild = this.user.guild;
		this.secret.logined = true
		const { startload } = require("../collectors/BaseMessageCollector");
		this.games = new this.games({
			client: this,
			userFetch: true
		})
		const ignores = await this.ignores.fetch()
		ignores.map(n => this.secret.ignoreUsers.push(n.id))
		this.emit("ready", this);
		startload(this);
		return true;
	}
	async loginByToken(token){
		if (this.secret.logined) throw new Error("Already Logined.")
		this.emit("debug", "[Debug] Login requested.")
		this.emit("debug", `Recieved Token: ${token.slice(0,12)}${token.slice(12).replace(/./g, "*")}`)
		const { ID, Pass, SID, SKEY } = toData(token);
		this.emit("debug", `[Debug] Token was parsed. ID: ${ID.slice(0,2)}${ID.slice(2).replace(/./g, "*")} Pass: ${Pass.slice(0,2)}${Pass.slice(2).replace(/./g, "*")} SID: ${SID} SKEY: ${(`${SKEY}`).slice(0,4)}${(`${SKEY}`).slice(4).replace(/./g, "*")}`)
		try {
			await this.loginByData(SID,SKEY);
			return
		} catch (e) {
			if (this.secret.logined) throw e
			this.emit("debug", "[Debug] Login by secret data is failed.")
			await this.loginByIdPass(ID, Pass);
			console.warn("Login successed, but secret data is invalid. You need to regenerate token.");
			return;
		}
	}
	async logout(post = false){
		if (!this.secret.logined) throw new Error("Already Logouted.")
		this.emit("debug", "[Debug] Logout Requested.")
		this.secret.chatload = false
		if (post) await api.post(api.links.Logout, {
			marumie: this.secret.id,
			seskey: this.secret.key
		})
		delete this.token
		this.addons = {}
		this.secret.id = "";
		this.secret.key = "";
		this.users = require("../managers/UserManager");
		this.guilds = require("../managers/GuildManager");
		this.BBSs = require("../managers/BBSGetter");
		this.ignores = require("../managers/ClientUserIgnoreManager")
		this.friends = require("../managers/ClientUserFriendsManager")
		this.games = require("./GameClient");
		this.secret.logined = false;
		this.emit("debug", "[Debug] Logouted.");
		return;
	}
}
