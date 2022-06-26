"use strict";
const { EventEmitter } = require("node:events");
const { fetch } = require("./system/");

class Base extends EventEmitter {
}

class Data {
  constructor(a,b){
    for (const n in a){
      this[n] = a[n]
    }
    this.client = b
    this.parseData = a
  }
  toString(){
    return this.name
  }
  clone(){
    return new this.constructor(this.parseData)
  }
}

class Client extends Base {
  constructor(options) {
    super();
    this.id = "";
    this.pass = "";
    this.users = require("./user/");
    this.guilds = require("./guild/");
    this.secret = {
      id: undefined,
      key: undefined,
      options: options
        ? typeof options == "Object"
          ? OptionsToArray(options)
          : options
        : new Array(),
    };
  }
  async login(id = this.id, pass = this.pass) {
    if (!id || !pass)
      return new Error("ID or PASS is invalid.(Error Code 100)");
    if (!id.match(/^[a-z0-9]{4,20}$/) || !pass.match(/^[a-z0-9]{4,20}$/))
      return new Error("ID or PASS is invalid.(Error Code 101)");
    const result = await fetch("http://himaquest.com/top_LoginGame2.php", {
      fid: id,
      fpass: pass,
      hkey: 1,
    });
    if (result.error == 2) {
      return new Error("ID or PASS is wrong. (Error Code 102)");
    } else if (result.error == 404) {
      return new Error("ERROR 404 (Banned.)");
    } else {
      this.secret.id = result.userid
      this.secret.key = result.seskey
      this.guilds = new this.guilds(this);
      this.users = new this.users(this);
      this.user = await this.users.fetch(result.userid);
      this.guild = this.user.guild
      this.emit("ready", this);

      const { startload } = require("./chat/");
      startload(this, result.kbmark);

      return true;
    }
  }
}

function OptionsToArray(options) {
  const array = new Array();
  if (options.SaveCache === false) {
    if (array.NotSaveCache === false) return new Error("Options is invalid.(Code:001)");
    if (!array.includes("NotSaveCache")) array[array.length] = 1 << 1
  }
  if (options.NotSaveCache === true) {
    if (array.SaveCache === true) return new Error("Options is invalid.(Code:002)");
    if (!array.includes("NotSaveCache")) array[array.length] = 1 << 1
  }
  if (options.LoadCache === false) {
    if (array.NotLoadCache === false) return new Error("Options is invalid.(Code:001)");
    if (!array.includes("NotLoadCache")) array[array.length] = 1 << 2
  }
  if (options.NotLoadCache === true) {
    if (array.LoadCache === true) return new Error("Options is invalid.(Code:002)");
    if (!array.includes("NotLoadCache")) array[array.length] = 1 << 2
  }
  if (options.RecieveAreaMessage === true){
    array[array.length] = 1 << 3
  }
}

exports.Client = Client
exports.Base = Base
exports.Data = Data
exports.Errors = require("./Errors.js")
