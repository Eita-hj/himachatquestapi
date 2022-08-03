const Fetch = require("node-fetch");

const fetch = async function (url, option) {
	let result;
	if (option) {
		const body =
			typeof option == "string"
				? option
				: typeof option == "object"
				? new URLSearchParams(option).toString()
				: null;
		if (option) {
			await Fetch(url, {
				method: "post",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: body,
			})
				.then((n) => n.text())
				.then((n) => (result = n));
		} else {
			await Fetch(url, {
				method: "post",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			})
				.then((n) => n.text())
				.then((n) => (result = n));
		}
	} else {
		await Fetch(url, {
			method: "post",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		})
			.then((n) => n.text())
			.then((n) => (result = n));
	}
	eval(`result = ${result}`);
	if (result.error == 404) throw new Error("ERROR 404 (Banned.)");
	return result;
};

const convtext = function (name) {
	return name
		.split("<small style='color:#AAAAAA'>")[0]
		.split("&#039;")
		.join("'")
		.split("&quot;")
		.join('"')
		.split("&lt;")
		.join("<")
		.split("&gt;")
		.join(">")
		.split("&amp;")
		.join("&");
};

class Bits {
	constructor(obj){
		this.DefaultFlags = obj.default
		if (obj.data == undefined) return this.bits = 0n
		if (typeof obj.data == "bigint") return this.bits = obj.data;
		if (!Array.isArray(obj.data)) throw new Error("Setting Bits Error")
		let bits = obj.data.map(n => typeof n == "string" ? this.DefaultFlags[n] : typeof n == "bigint" ? n : null)
		if (bits.includes(null)) throw new Error("Setting Bits Error")
		this.bits = bits.reduce((a, b) => a + b)
	}
	set (bits){
		return new this.constructor({
			default: this.DefaultFlags,
			data: bits
		})
	}
	toArray(){
		const array = new Array()
		for (const flag in this.DefaultFlags){
			if (this.bits & this.DefaultFlags[flag]) array[array.length] = flag
		}
		return array
	}
	toBitArray(){
		const array = new Array()
		for (const flag in this.DefaultFlags){
			if (this.bits & this.DefaultFlags[flag]) array[array.length] = this.DefaultFlags[flag]
		}
		return array
	}
	has(bits){
		const boolean = typeof bits == "string" 
			? this.toArray().includes(bits)
			: typeof bits == "bigint"
				? this.toBitArray().includes(bits)
				: Array.isArray(bits)
					? bits.map(n => this.has(n)).includes(false)
					: new Error("<Bits>.has option is invalid.")
		if (typeof boolean !== "boolean") throw boolean;
		return boolean;
	}
}
const OptionBits = new Bits(
	{
		default: {
			AreaMessages: 1n << 0n,
			GuildMessages: 1n << 1n,
			UsersCache: 1n << 2n,
			GuildCache: 1n << 3n,
		}
	}
)

exports.OptionBits = OptionBits;
exports.fetch = fetch;
exports.convtext = convtext;