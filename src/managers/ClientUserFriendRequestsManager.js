const BaseManager = require("./BaseManager");
const { api, convtext } = require("../utils/");
const Cache = require("../structures/Cache");
const FriendRequestUser = require("../structures/FriendRequestUser");

class ClientUserFriendRequestsManager extends BaseManager {
  async fetch() {
    const { sinseidata } = await api.post(api.links.User.Friends.List, {
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
    });
    const users = sinseidata.map((user) => ({
      id: user.uid,
      requestid: user.sinseiid,
      recieved: user.updated,
    }));
    const data = new Cache();
    for (let i = 0; i < users.length; i++) {
      const userdata = users[i];
      const user = await this.client.users.get(userdata.id);
      const recievedTimestamp = Date.parse(
        userdata.lastlogined.split("-").join("/")
      );
      const recievedAt = new Date(recievedTimestamp);
      user.save({
        recievedTimestamp,
        recievedAt,
        requestid: userdata.requestid,
      });
      if (this.client.secret.caches.has(1n << 4n)) data.set(user.id, user);
    }
    return data;
  }
  async allow(data) {
    const requestId = data instanceof FriendRequestUser ? data.requestId : data;
    if (!requestId || !Number.isSafeInteger(Number(requestId)))
      throw new TypeError(
        "FriendRequestAllowData must be requestIdResolvable."
      );
    await api.post(api.links.User.FriendRequests.Allow, {
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
      sinseiid: requestId,
    });
  }
  async deny(data) {
    const requestId = data instanceof FriendRequestUser ? data.requestId : data;
    if (!requestId || !Number.isSafeInteger(Number(requestId)))
      throw new TypeError("FriendRequestDenyData must be requestIdResolvable.");
    await api.post(api.links.User.FriendRequests.Deny, {
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
      sinseiid: requestId,
    });
  }
}
