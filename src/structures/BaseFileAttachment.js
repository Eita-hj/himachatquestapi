const FormData = require("form-data")
const { api } = require("../utils/")

module.exports = class BaseFileAttachment {
	constructor(client, file, id){
		if (!client || !file) return
		this.data = new FormData()
		this.client = client
		this.data.append("MAX_FILE_SIZE", "2000000")
		this.data.append("marumie",`${client.secret.id}`)
		this.data.append("seskey",`${client.secret.key}`)
		const toBuffer = require("buffer-to-stream")
		const { createReadStream, ReadStream } = require("fs")
		const f = (typeof file == "string" || Buffer.isBuffer(file)) ? createReadStream(file) : (file instanceof ReadStream) ? file : null
		if (f === null) throw new Error(`${file} is invalid.`)
		if (f.size > (2 << 20)) throw new Error(`${file} size is over 2MB.`)
		this.data.append("puri", f)
		this.id = id
		this.url = typeof file == "string" ? file : undefined
	}
	async delete(){
		if (!this.id) throw new Error("File ID is undefined.")
		api.post(api.links.Attachment.Delete, {
			marumie: this.client.secret.id,
			seskey: this.client.secret.key,
			imgid: this.id
		})
	}
}
