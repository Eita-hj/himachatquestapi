const Bits = require("./Bits")
module.exports = new Bits(
	{
		default: {
			MessageContents: 1n << 0n,
			MessageFiles: 1n << 1n,
			GuildDungeons: 1n << 2n
		}
	}
)
