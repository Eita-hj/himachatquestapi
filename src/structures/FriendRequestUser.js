const User = require("./User")
module.exports = class FriendRequestUser extends User {
  async allow() {
    this.client.friends.requests.allow(this)
  }
  async deny() {
    this.client.friends.requests.deny(this)
  }
}
