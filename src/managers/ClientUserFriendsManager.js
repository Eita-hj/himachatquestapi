const BaseManager = require("./BaseManager");
const { api, convtext } = require("../utils/");
const Cache = require("../structures/Cache");
const ClientUserFriendRequestsManager = require("./ClientUserFriendRequestsManager");
const FriendUser = require("../structures/FriendUser");

class ClientUserFriendsManager extends BaseManager {
  constructor(client) {
    super(client);
    this.recieves = new ClientUserFriendRequestsManager(client);
  }
  async fetch() {
    const { frienddata } = await api.post(api.links.User.Friends.List, {
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
    });
    const users = frienddata.map((user) => ({
      id: user.friend,
      lastlogined: user.updated,
    }));
    const data = new Cache();
    for (let i = 0; i < users.length; i++) {
      const userdata = users[i];
      const user = await this.client.users.get(userdata.id);
      const lastLoginedTimestamp = Date.parse(
        userdata.lastlogined.split("-").join("/")
      );
      const lastLoginedAt = new Date(lastLoginedTimestamp);
      user.save({
        lastLoginedTimestamp,
        lastLoginedAt,
      });
      const frienduser = new FriendUser();
      if (this.client.secret.caches.has(1n << 4n)) data.set(user.id, user);
    }
    return data;
  }
  async delete(data) {
    const userId = data instanceof FriendUser ? data.id : data;
    if (!userId || !Number.isSafeInteger(Number(userId)))
      throw new TypeError("FriendDeleteData must be FriendUser or userid.");
    await api.post(api.links.User.Friends.Delete, {
      marumie: this.client.secret.id,
      seskey: this.client.secret.key,
      sinseiid: userId,
    });
  }
}
