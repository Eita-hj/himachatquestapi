const Bits = require("./Bits")
module.exports = new Bits(
	{
		default: {
			AreaMessages: 1n << 0n,
			GuildMessages: 1n << 1n,
			UserCache: 1n << 2n,
			GuildCache: 1n << 3n,
			DirectMessages: 1n << 4n,
			BBSCache: 1n << 5n
		}
	}
)
