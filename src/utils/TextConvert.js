module.exports = function (text) {
	return text
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
