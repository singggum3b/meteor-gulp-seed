require("babel-polyfill");

//=================init data=======================
if (process.env.REMOTE) {
	window.initData = Object.assign({}, require("client/initData").remote, window.initData);
} else {
	window.initData = Object.assign({}, require("client/initData").local, window.initData);
}
//=================App=======================
require("client/.css/style.css");
require("client/js/lib.entry.js")(window);
require("client/js/app.entry.js");

//=================HMR Management=======================
if (module.hot) {
	module.hot.accept(["client/js/app.entry.js"]);
}
