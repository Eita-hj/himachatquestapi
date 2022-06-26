const { fetch, convtext } = require("../system/");
const { Base } = require("../index.js");
class users extends Base {
  constructor(client) {
    super();
    this.client = client;
    this.cache = new Map()
  }
  async fetch(id) {
    if (!id) return new Error(`${id} is invalid. (Error Code 500)`)
    if (isNaN(id)) return new Error(`${id} is invalid. (Error Code 501)`)
    const source = await fetch("http://himaquest.com/UserWindow.php", {
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
        name: source.source.split("<span style='color:#AAAAAA;font-size:8px;vertical-align:super;float:left;'>所属</span>\r\n")[1].split("</div>")[0].split(/\s/).join("")
      }
      if (id == this.client.secret.id) {
        let guildid = await fetch("http://himaquest.com/load_MyGuildList.php", {
          marumie: this.client.secret.id,
          seskey: this.client.secret.key,
        });
        guildid = guildid.myguild;
        result.guild =
          guildid == 0 ? null : await this.client.guilds.fetch(guildid);
      }
      const ip = await fetch("http://himaquest.com/block_UserKanriWindow.php", {
        marumie: this.client.secret.id,
        seskey: this.client.secret.key,
        targetid: id
      })
      result.ip = ip.source.split("\r\n")[2].split("\t").join("").split("<br />").join("")
    } else {
      const ip = await fetch("http://himaquest.com/block_UserKanriWindow.php", {
        marumie: this.client.secret.id,
        seskey: this.client.secret.key,
        targetid: id
      })
      result.name = ip.source.split("<h3>")[1].split("</h3>")[0]
      result.id = id
      result.rank = null
      result.profile = "利用停止されたアカウントです。"
      result.lastlogin = new Date(0)
      result.ip = ip.source.split("\r\n")[2].split("\t").join("").split("<br />").join("")
    }
    if (!this.client.secret.options.includes("NotSaveCache")) {
      if (this.cache.has(result.id)) this.cache.delete(result.id);
      this.cache.set(result.id, result);
    }
    return new user(result, this.client);
  }
  async get(id) {
    return this.cache.has(id) ? this.cache.get(id) : await this.fetch(id);
  }
}


const { Data } = require("../index.js")
class user extends Data {
  async resolve(){
    const result = await this.client.users.fetch(this.id)
    for (const n in result){
      this[n] = result[n]
    }
    this.parseData =  result
    return this
  }
  async send(content){
    if (!(typeof content == "string" || typeof content == "number"))
      return new Error("Message type Error(Error Code 300)");
    if (String(content.length) > 150)
      return new Error("Message length Error(Error Code 301)");
    if (!content) return new Error("Cannot send Empty message(Error Code 302)");
    if (this.id === this.client.user.id) return new Error("Message target Error(Error Code 304)")
    await fetch("http://himaquest.com/chat_HatugenKobetu.php", {
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
      monku: content.split("\n").join(" "),
      target: this.id
    })
    return;
  }
}

module.exports = users;
