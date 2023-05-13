exports.toToken = function (data){
	const json = JSON.stringify({...data, version: 2})
	return Buffer.from(json).toString("base64")
}
exports.toData = function (data){
	const json = Buffer.from(data, "base64").toString()
	return JSON.parse(json)
}
