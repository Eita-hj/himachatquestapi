class Cache extends Map {
	isCache(d){
		return d.constructor == this.constructor
	}
	at(i){
		return this.first(i)
	}
	concat(...d){
		if (d.length == 0) throw TypeError("undefined is not Cache or Array")
		const check = d.filter(n => !Array.isArray(n) && !this.isCache(n))
		if (check.length) throw TypeError(`${check} is not Cache or Array`)
		const data = [];
		d.forEach(n => {
		if (this.isCache(n)){
			[...n].forEach(m => data.push(m))
		} else {
			data.push(n)
		}
		})
		return new this.constructor(([...this]).concat(data));
	}
	each(f){
		this.forEach(f)
		return this
	}
	firstKey(count = 0){
		return [...this][count][0]
	}
	first(count = 0){
		return this.get(this.firstKey(count))
	}
	lastKey(count = 0){
		return [...this][this.size - count - 1][0]
	}
	last(count = 0){
		return this.get(this.lastKey(count))
	}
	findKey(f){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		const array = [...this]
		for (let i = 0; i < array.length; i++){
		if (f.call(array[i],array[i][1],array[i][0],this)) return this.firstKey(i)
		}
	}
	hasAll(a){
		return a.filter(n => this.has(n)).length == a.length
	}
	hasAny(a){
		return a.some(n => this.has(n))
	}
	find(f){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		return this.get(this.findKey(f))
	}
	filter(f){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		const array = [...this]
		const arr = []
		for (let i = 0; i < array.length; i++){
		if (f.call(array[i],array[i][1],array[i][0],this)) arr.push(array[i])
		}
		return new this.constructor(arr)
	}
	map(f, type = 1){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		if (type == 0 || type == "cache"){
		const array = [...this]
		const arr = []
		for (let i = 0; i < array.length; i++){
			arr.push([array[i][0],f.call(array[i],array[i][1],array[i][0],this)])
		}
		return new this.constructor(arr)
		}
		if (type == 1 || type == "array"){
		const array = [...this]
		const arr = []
		for (let i = 0; i < array.length; i++){
			arr.push(f.call(array[i],array[i][1],array[i][0],this))
		}
		return arr
		}
	}
	clone(){
		return new this.constructor([...this])
	}
	tap(f){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		f.call(this, this)
		return this
	}
	some(f){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		return this.findKey(f) == undefined ? false : true
	}
	every(f){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		return ([...this.filter(f)]).length == this.size
	}
	randomKey(){
		const array = [...this]
		return array[Math.floor(Math.random() * array.length)][0]
	}
	random(){
		return this.get(this.randomKey())
	}
	reduce(f, init = {toString: () => {return ""},valueOf: () => {return 0}}){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		const array = [...this]
		let v = init
		for (let i = 0; i < this.size; i++){
		v = f.call(this,array[i][1],v)
		}
		return v
	}
	reverse(){
		return new this.constructor(([...this]).reverse())
	}
	equals(c){
		const clone = this.clone()
		const clone2 = c.clone()
		let boolean = true
		clone.forEach((v,k) => {
		if (this.isCache(clone.get(k))){
			if (this.isCache(clone2.get(k))){
			if (!clone.get(k).equals(clone2.get(k))) boolean = false
			} else {
				boolean = false
			}
		} else if (clone2.get(k) !== v){
			boolean = false
		}
		clone.delete(k)
		clone2.delete(k)
		})
		if (!clone.size && !clone2.size && boolean) return true
		return false
	}
	sortKey(f){
		return new this.constructor(([...this]).map(n => n[0]).sort(f).map(n => ([n, this.get(n)])))
	}
	sort(f){
		const array = ([...this]).map(n => n[1]).sort(f)
		const arr = []
		const c = new this.constructor()
		array.forEach(n => {
			const key = ([...this]).find(m => (m[1] == n && !arr.includes(m[0])))
			c.set(key[0],key[1])
			arr.push(key[0])
		})
		return c
	}
}
module.exports = Cache