const User = require("./User")
module.exports = class FriendUser extends User {
  async delete() {
    this.client.friends.delete(this)
  }
}
