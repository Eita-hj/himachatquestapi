module.exports = class Bits {
	constructor(obj){
		this.Flags = obj.default
		if (obj.data == undefined) return this.bits = 0n
		if (typeof obj.data == "number") return this.bits = BigInt(obj.data);
		if (typeof obj.data == "bigint") return this.bits = obj.data;
		if (!Array.isArray(obj.data)) throw new Error("Bit Setting Error (Code:600)")
		let bits = obj.data.filter((n, m) => obj.data.indexOf(n) === m).map(n => typeof n == "string" ? this.Flags[n] : typeof n == "bigint" ? n : typeof n == "number" ? BigInt(n) : null)
		if (bits.includes(null)) throw new Error("Bit Setting Error (Code:601)")
		if (bits.length === 0) return this.bits = 0n
		this.bits = bits.reduce((a, b) => a + b) || 0n
	}
	set(bits){
		return new this.constructor({
			default: this.Flags,
			data: bits
		})
	}
	toArray(){
		const array = new Array()
		for (const flag in this.Flags){
			if (this.bits & this.Flags[flag]) array[array.length] = flag
		}
		return array
	}
	toBitArray(){
		const array = new Array()
		for (const flag in this.Flags){
			if (this.bits & this.Flags[flag]) array[array.length] = this.Flags[flag]
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
					: new Error("<Bits>.has option is invalid. (Code:602)")
		if (typeof boolean !== "boolean") throw boolean;
		return boolean;
	},
	hasAny(array){
		if (!Array.isArray(array)) throw new TypeError("Bits.hasAny option must be array.")
		return !array.map(n => this.has(n)).filter(n => !n).length
	}
}
