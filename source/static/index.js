"use strict";

module.exports = function (window) {
	//==========================================
	global.window = window;
	global.document = window.document;
	global.navigator = window.navigator;
//================================================
	window.DEVICE = ["phone", "tablet", "desktop"];
	require("./lib.js")(window);
//================================================

	let {Router,Route,IndexRoute}= ReactRouter;
	let Device = require("client/js/components/device");
	let MasterPage = require("static/pages/master");
	let IndexPage = require("static/pages/index");
	let CustomerPage = require("static/pages/customer");
	let DeviceList = [
		{name: "phone", breakpoint: 640},
		{name: "tablet", breakpoint: 960},
		{name: "desktop", breakpoint: Infinity}
	];

	return (
			<html>
			<head>
				<title>{document.title}</title>
				<link rel="stylesheet" type="text/css" href="css/style.css" />
				<script src="js/script.js"></script>
			</head>
				<body>
					<Device className="app" device={DeviceList}>
						<Router history={History.createHistory()}>
							<Route path="/" component={MasterPage}>
								<IndexRoute component={IndexPage}/>
								<Route path="/customer" component={CustomerPage} ></Route>
							</Route>
						</Router>
					</Device>
				</body>
			</html>
	);
};
