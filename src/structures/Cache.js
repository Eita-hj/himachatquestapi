class Cache extends Map {
	at(i){
		return ([...this]).at(i)?.[1]
	}
	concat(...d){
		if (d.length == 0) throw TypeError("undefined is not Cache or Array")
		const check = d.filter(n => !Array.isArray(n) && !Cache.isCache(n))
		if (check.length) throw TypeError(`${check} is not Cache or Array`)
		const data = [];
		d.forEach(n => {
			if (Cache.isCache(n)){
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
		return [...this.filter(f)][0]?.[0]
	}
	hasAll(a){
		return a.filter(n => this.has(n)).length == a.length
	}
	hasAny(a){
		return a.some(n => this.has(n))
	}
	find(f){
		return [...this.filter(f)][0]?.[1]
	}
	filter(f){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		const array = [...this]
		return new this.constructor(array.filter((v, k, a) => f(v[1], v[0], this)))
	}
	map(f){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		const array = [...this]
		return array.map((v, k, a) => f(v[1], v[0], this))
	}
	clone(){
		return new this.constructor([...this])
	}
	tap(f){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		f(this)
		return this
	}
	some(f){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		return !!this.filter(f).length
	}
	every(f){
		if (typeof f !== "function") throw new TypeError(`${f} is not a function`)
		return this.filter(f).size == this.size
	}
	randomKey(){
		const array = [...this]
		return array[Math.floor(Math.random() * array.length)][0]
	}
	random(){
		return this.get(this.randomKey())
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
Cache.isCache = function (d){
	return d.constructor == Cache
}

module.exports = Cache
