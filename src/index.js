"use strict";
const { EventEmitter } = require("node:events");
const { fetch, OptionBits } = require("./system/");

class Base extends EventEmitter {}

class Data {
	static parseData;
	constructor(a, b) {
		for (const n in a) {
			this[n] = a[n];
		}
		this.client = b;
		this.parseData = a;
	}
	toString() {
		return this.name;
	}
	clone() {
		return new this.constructor(this.parseData);
	}
}

class Client extends Base {
	constructor(options) {
		super();
		this.id = "";
		this.pass = "";
		this.users = require("./user/");
		this.guilds = require("./guild/");
		if (options.option == undefined) throw new Error("Option is invalid.")
		this.secret = {
			id: undefined,
			key: undefined,
			options: OptionBits.set(options.option),
			logined: false
		};
	}
	async login(id = this.id, pass = this.pass) {
		if (this.secret.logined) throw new Error("Already Logined.")
		this.emit("debug", "[Debug] Login Requested.")
		this.emit("debug", `[Debug] Recieved ID:${id.slice(0,2)}${id.slice(2).replace(/./g, "*")} Recieved PASS:${pass.slice(0,2)}${pass.slice(2).replace(/./g, "*")}`)
		if (!id || !pass) throw new Error("ID or PASS is invalid.(Error Code 100)");
		if (!id.match(/^[a-z0-9]{4,20}$/) || !pass.match(/^[a-z0-9]{4,20}$/))
			return new Error("ID or PASS is invalid.(Error Code 101)");
		const result = await fetch("http://himaquest.com/top_LoginGame2.php", {
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
			this.user = await this.users.fetch(result.userid);
			this.guild = this.user.guild;
			this.emit("ready", this);
			this.logined = true
			const { startload } = require("./chat/");
			startload(this, result.kbmark);

			return true;
		}
	}
	async logout(send = true){
		if (!this.secret.logined) throw new Error("Already Logouted.")
		this.secret.logined = false
		this.emit("debug", "[Debug] Logout Requested.")
		if (send) await fetch("http://himaquest.com/top_ExitGame.php", {
			marumie: this.secret.id,
			seskey: this.secret.key
		})
		this.secret = {
			id: "",
			key: "",
			users: require("./user/"),
			guilds: require("./guild/")
		}
		this.emit("debug", "[Debug] Logouted.")
	}
}

exports.Client = Client;
exports.Base = Base;
exports.Data = Data;
exports.OptionBits = OptionBits;
exports.Errors = require("./Errors.js");
exports.Game = require("./Game.js");