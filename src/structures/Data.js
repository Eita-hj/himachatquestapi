module.exports = class Data {
	#parseData;
	constructor(a, b) {
		for (const n in a) {
			this[n] = a[n];
		}
		this.client = b;
		this.#parseData = a;
	}
	toString() {
		return this.name;
	}
	clone() {
		return new this.constructor(this.#parseData, this.client);
	}
	save(data){
		this.#parseData = {...this.#parseData, ...data}
	}
}
