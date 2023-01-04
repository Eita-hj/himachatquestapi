const Bits = require("./Bits")
module.exports = new Bits(
	{
		default: {
			DirectMessages: 1n << 0n,
			AreaMessages: 1n << 1n,
			GuildMessages: 1n << 2n,
			GuildBBSs: 1n << 3n,
		}
	}
)
