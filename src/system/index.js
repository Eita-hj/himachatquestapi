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
  eval("result = " + result);
  if (result.error == 404) return new Error("ERROR 404 (Banned.)");
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

exports.fetch = fetch;
exports.convtext = convtext;
