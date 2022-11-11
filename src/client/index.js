'use strict';
const { EventEmitter } = require("node:events");
const OptionBits = require("../structures/OptionBits")
const { api } = require("../utils/")

module.exports = class Client extends EventEmitter {
	constructor(options) {
		super();
		this.id = "";
		this.pass = "";
		this.users = require("../managers/UserManager");
		this.guilds = require("../managers/GuildManager");
		this.BBSs = require("../managers/BBSGetter");
		if (options.option == undefined) throw new Error("Option is invalid.")
		this.secret = {
			id: undefined,
			key: undefined,
			options: OptionBits.set(options.option),
			logined: false,
			chatload: false
		};
	}
	async login(type, data1, data2){
		switch (type){
			case "IDPASS":
			case "IDPass":
			case "IdPass":
				this.loginByIdPass(data1, data2);
				break;
			case "Data":
			case "SIDSKEY":
				this.loginByData(data1, data2);
				break;
			case "TOKEN":
			case "token":
			case "Token":
				this.loginByToken(data1)
				break;
			default:
				throw new TypeError("Login Type is invalid.")
		}
	}
	async loginByIdPass(id = this.id, pass = this.pass) {
		if (this.secret.logined) throw new Error("Already Logined.")
		this.emit("debug", "[Debug] Login Requested.")
		this.emit("debug", `[Debug] Recieved ID:${id.slice(0,2)}${id.slice(2).replace(/./g, "*")} Recieved PASS:${pass.slice(0,2)}${pass.slice(2).replace(/./g, "*")}`)
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
			this.BBSs = new this.BBSs(this);
			this.user = await this.users.fetch(result.userid);
			this.guild = this.user.guild;
			this.emit("ready", this);
			this.logined = true
			const { startload } = require("../collectors/BaseMessageCollector");
			startload(this, result.kbmark, result.hbmark);

			return true;
		}
	}
	async loginByData(SID, SKEY){
		this.emit("debug", "[Debug] Login Requested.")
		this.emit("debug", `[Debug] Recieved SID:${SID} Recieved SKEY:${SKEY.slice(0,4)}${SKEY.slice(4).replace(/./g, "*")}`)
		
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
		this.BBSs = new this.BBSs(this);
		this.user = await this.users.fetch(Number(SID));
		this.guild = this.user.guild;
		this.emit("ready", this);
		this.logined = true
		const { startload } = require("../collectors/BaseMessageCollector");
		startload(this, result.kbmark, result.hbmark);

		return true;
	}
	async loginByToken(token){
		const { toData } = require("../utils/GenerateToken");
		const { ID, Pass, SID, SKEY } = toData(token);
		try {
			await this.loginByData(SID,SKEY);
			return
		} catch (e) {
			this.emit("debug", "Login by secret data is failed.")
			await this.loginByIdPass(ID, Pass);
			console.warn("Login successed, but secret data is invalid. So you need to regenerate token.");
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
		this.secret.id = "";
		this.secret.key = "";
		this.users = require("../managers/UserManager");
		this.guilds = require("../managers/GuildManager");
		this.BBSs = require("../managers/BBSGetter");
		this.secret.logined = false;
		this.emit("debug", "[Debug] Logouted.");
		return;
	}
}
