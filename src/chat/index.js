const { convtext, fetch } = require("../system/");

const startload = function (client, kbmark) {
  if (client.user.guild?.id) get_guildChat(client);
  get_areaChat(client, kbmark)
};

async function get_guildChat(client) {
  let bmark = await fetch("http://himaquest.com/chat_GuildChatEntry.php", {
    marumie: client.secret.id,
    seskey: client.secret.key,
  });
  bmark = bmark.bmark
  for (let rate = 1; !client.secret.loading; rate++) {
    const obj = await fetch("http://himaquest.com/chat_F5Guild.php", {
      marumie: client.secret.id,
      seskey: client.secret.key,
      bmark: bmark,
      rate: rate,
    });
    const result = new Object();
    result.client = client;
    result.guild = client.user.guild;
    if (!!obj.coments[0]) {
      bmark = obj.bmark;
      let c = obj.coments[0].source;
      result.author = client.secret.options.includes("NotLoadCache") ? await client.users.fetch() : await client.users.get(obj.coments[0].uid);
      if (
        c.includes(
          "<a href='javascript:void(0);' class='astyle' onclick='PhotoGet(this,"
        )
      ) {
        result.type = "image";
        let pid = c.split("PhotoGet(this,")[1];
        let pkey = pid.split(',"')[1].split('")')[0];
        pid = pid.split(",")[0];
        let tag = await fetch("http://himaquest.com/photo_Get.php", {
          marumie: client.secret.id,
          seskey: client.secret.key,
          imgid: pid,
          imgpass: pkey,
        })
        tag = tag.source
        if (tag.includes(".png")) {
          tag = ".png";
        } else if (tag.includes(".jpg")) {
          tag = ".jpg";
        } else if (tag.includes(".gif")) {
          tag = ".gif";
        } else if (tag.includes(".jpeg")) {
          tag = ".jpeg";
        }
        result.content = null;
        result.file = {
          url: `http://himaquest.com/PhotoBBS/${pid}${pkey}${tag}`,
        };
      } else {
        result.type = "text";
        result.file = null;
        c = convtext(
          c
            .split("\t")
            .join("")
            .split("<td class='c_mozi' style='color:#000000'>")[1]
            .split("\n")[0]
        );
        result.content = c
      }
      client.emit("GuildMessageCreate", result);
      client.emit("GuildMessage", result);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function get_areaChat(client, defaultbmark) {
  let bmark = await fetch("http://himaquest.com/chat_F5User.php", {
    marumie: client.secret.id,
    seskey: client.secret.key,
    bmark: defaultbmark,
  }).bmark;
  for (; !client.secret.id; ) {
    const data = await fetch("http://himaquest.com/chat_F5User.php", {
      marumie: client.secret.id,
      seskey: client.secret.key,
      bmark: bmark,
    });
    if (!!data.coments[0]) {
      for (let i = 0; i < data.coments.length; i++) {
        bmark = data.bmark;
        let source = data.coments[i].source;
        let result = new Object();
        result.content = convtext(
          source
            .split("\t")
            .join("")
            .split("<td class='c_mozi' style='color:#000000'>")[1]
            .split("\n")[0]
        );
        result.author = client.cache.secret.options.includes("NotLoadCache")
          ? await client.users.fetch(data.coments[i].uid)
          : await client.users.get(data.coments[i].uid);
        client.emit("AreaMessageCreate", result);
        client.emit("AreaMessage", result);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
exports.startload = startload;
