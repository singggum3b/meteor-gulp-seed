"use strict";

module.exports = function (window) {
	//==========================================
	global.window = window;
	global.document = window.document;
	global.navigator = window.navigator;
//================================================
	window.DEVICE = ["phone", "tablet", "desktop"];
	require("../js/lib.entry.js")(window);
//================================================

	let {Router,Route,IndexRoute}= ReactRouter;
	let Device = require("client/js/components/device");
	let MasterPage = require("client/js/pages/master.js");
	let IndexPage = require("client/js/pages/index.js");
	let DeviceList = [
		{name: "phone", breakpoint: 640},
		{name: "tablet", breakpoint: 960},
		{name: "desktop", breakpoint: Infinity}
	];

	let index = React.createClass({
		render(){
			return (
					<div>ABCEDF</div>
			)
		}
	});

	return (
			<Device className="v-coach-app" device={DeviceList}>
				<Router history={History.createHistory()}>
					<Route path="/" component={MasterPage}>
						<IndexRoute component={IndexPage}/>
					</Route>
				</Router>
			</Device>
	);
};
