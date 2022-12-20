const Bits = require("./Bits")
module.exports = new Bits({
	default: {
		Users: 1n << 0n,
		Guilds: 1n << 1n,
		GuildBBSs: 1n << 2n,
		ClientUserFriends: 1n << 3n,
		ClientUserIgnoreList: 1n << 4n,
		GameRanking: 1n << 5n
	}
})
