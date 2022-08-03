const { fetch, convtext } = require("../system/");
const { Base } = require("../index.js");

class GuildManager extends Base {
  constructor(client) {
    super();
    this.client = client;
    this.cache = new Map();
  }
  async fetch(id) {
    if (!id) throw new Error(`${id} is invalid. (Error Code 500)`)
    if (isNaN(id)) throw new Error(`${id} is invalid. (Error Code 501)`)
    let source = await fetch("http://himaquest.com/guild_Window.php", {
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
      targetid: id,
    });
    source = source.source;
    const result = new Object();
    result.id = id;
    result.name = source
      .split("<div class='gw_guildname'>")[1]
      .split("</div>")[0];
    result.PR = convtext(source.split("<div class='gw_guildpr'>")[1].split("</div>")[0]);
    result.info = source
      .split("<div class='gw_setumei'>")[1]
      .split("</div>")[0]
      .split("<br />")
      .join("\n");
    result.ownerID = source
      .split("<span onclick='UserWindow(")[1]
      .split(")")[0];
    result.owner = result.ownerID == this.client.secret.id ? this.user : await this.client.users.get(result.ownerID)
    if (!this.client.secret.options.has(1n << 2n)) {
      if (this.cache.has(result.id)) this.cache.delete(result.id);
      this.cache.set(result.id, result);
    }
    return new Guild(result, this.client);
  }
}

const { Data } = require("../index.js")

class Guild extends Data {
  async send(msg) {
    if (this.id !== this.client.user.guild.id) throw new Error("Message guild Error(Error Code 303)")
    if (!(typeof msg == "string" || typeof msg == "number"))
      throw new Error("Message type Error(Error Code 300)");
    if (String(msg.length) > 150)
      throw new Error("Message length Error(Error Code 301)");
    if (!msg) throw new Error("Cannot send Empty message(Error Code 302)");
    await fetch("http://himaquest.com/chat_HatugenGuild.php", {
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
      monku: msg.split("\n").join(" ")
    });
    return;
  }
  async resolve(){
    const data = await this.client.guilds.fetch(this.id)
    for (const n in data){
      this[n] = data[n]
    }
    this.parseData = data
    return this
  }
}

module.exports = GuildManager;
