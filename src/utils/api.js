const fetch = require("node-fetch");

exports.post = async function (url, option, type = 0) {
	let result;
	if (option) {
		const body =
			typeof option === "string"
				? option
				: typeof option === "object"
					? type === 1
						? option
						: new URLSearchParams(option).toString()
					: null;
		if (body) {
			const data = {
				method: "post",
				headers: { "Content-Type": type === 1 ? "multipart/form-data" :"application/x-www-form-urlencoded" },
				body
			}
			if (type === 1) delete data.headers["Content-Type"]
			result = await fetch(url, data).then((n) => n === 2 ? n.blob() : n.text());
		} else {
			result = await fetch(url, {
				method: "post",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			}).then((n) => n === 2 ? n.blob() : n.text());
		}
	} else {
		result = await fetch(url, {
			method: "post",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		}).then((n) => n === 2 ? n.blob() : n.text())
	}
	if (type == 2) return result
	result = result.slice(1)
	try {
		const parsed = JSON.parse(result)
		if (parsed.error == 404) throw new Error("ERROR 404 (Banned.)");
		return parsed;
	} catch (err) {
		return result
	}
};

exports.links = require("./data/links")