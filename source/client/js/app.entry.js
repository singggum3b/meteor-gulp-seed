//=======================Public Path=========================
window.publicPath = window.publicPath ? window.publicPath : process.env.WEBPACK_PUBLICPATH;
__webpack_public_path__ = window.publicPath;

//====================================================
//Manually optimize bundle - move common module to entry chunk
require.include("client/js/data/sample-data");
require.include("client/js/components/loading");

//=====================================================
//Devices
window.DEVICE = ["phone", "tablet", "desktop"];

//=============================================
let DeviceList = [
	{name: "phone", breakpoint: 750},
	{name: "tablet", breakpoint: 1025},
	{name: "desktop", breakpoint: Infinity}
];

var Head = require("client/js/views/head.js");
//====================Render Preloader===============================
var Preloader = require("client/js/components/loading");
$(function () {
	$(document.body).append(`<div id="app"></div>`);
	ReactDOM.render(<div><Head /><Preloader page/></div>, document.getElementById("app"));
});

//===============================PRELOAD ASSETS==============

require.ensure([], function (require) {
	var MediaStore = require("client/js/media");
	var ImgLoaded = Immutable.fromJS([]);
	var PreloadList = Immutable.fromJS(require("glob-filename-loader?publicPath=&root=source/client/img/!client/js/../img.preload"));

	PreloadList.map(function (img, index) {
		function requested() {
			ImgLoaded = ImgLoaded.push(img);
			console.log(`Image loaded : ${ImgLoaded.size}/${PreloadList.size}`);
			if (ImgLoaded.size == PreloadList.size) {
				MediaStore.actions.imagesLoaded();
			}
		}

		var _img = (new Image());
		_img.onerror = requested;
		_img.onload = requested;
		return _img.src = require("../img/" + img.replace(/^\//, ""));

	});
});
//=====================Policies=======================
function isUser() {
	try {
		return window.initData.drivers.profiles[0].id;
	} catch (e) {
		return false;
	}
}

console.log(isUser());

//=====================APP=======================
require.ensure([], function (require) {
	var {Router,Route,IndexRoute,IndexRedirect}= ReactRouter;
	var Device = require("client/js/components/device");
	var MasterPage = require("client/js/pages/master.js"),
		DriversLoginPage = require("client/js/pages/login.js"),
		DriversPage = require("client/js/pages/drivers"),
		DriversPostNews = require("client/js/pages/driver-post"),
		DriversForgotPwd = require("client/js/pages/driver-forgotpwd"),
		DriversRecoverPwd = require("client/js/pages/driver-resetpwd"),
		DriversDetailPage = require("client/js/pages/driver-detail"),
		DriversComparePage = require("client/js/pages/driver-compare"),
		NewsPage = require("client/js/pages/news"),
		CalendarPage = require("client/js/pages/calendar"),
		ArticlePage = require("client/js/pages/article"),
		NotFound404 = require("client/js/pages/404"),
		SearchPage = require("client/js/pages/search"),
		IndexPage = require("client/js/pages/index.js");

	$(()=> {

		ReactDOM.render(
			<Device className="v-app"
							device={DeviceList}>
				<Head />
				<Router history={History.createHistory()}>
					<Route path="/" component={MasterPage}>
						<IndexRoute component={IndexPage}/>
						<Route path="/drivers" component={DriversPage}></Route>
						<Route path="/drivers/login" component={DriversLoginPage} />
						<Route path="/drivers/postnews" component={DriversPostNews}>
							{!isUser() && <IndexRedirect to="/404"	/>}
						</Route>
						<Route path="/drivers/reset-password">
							<IndexRedirect to="/404"	/>
							<Route path=":token" component={DriversRecoverPwd} ></Route>
						</Route>
						<Route path="/drivers/forgot-password" component={DriversForgotPwd} />
						<Route path="/drivers/compare" component={DriversComparePage}></Route>
						<Route type="driver-details" path="/drivers/:id" component={DriversDetailPage}></Route>
						<Route path="/news" component={NewsPage}></Route>
						<Route path="/calendar" component={CalendarPage}></Route>
						<Route path="/search" component={SearchPage}></Route>
						<Route path="/news">
							<IndexRedirect to="/404"	/>
							<Route path=":id" component={ArticlePage}></Route>
						</Route>
						<Route path="/about" id="1" component={ArticlePage}></Route>
						<Route path="/terms" id="2" component={ArticlePage}></Route>
						<Route path="/contacts" id="3" component={ArticlePage}></Route>
						<Route path="/faqs" id="4" component={ArticlePage}></Route>
						<Route path="/editorial-guide" id="5" component={ArticlePage}></Route>
						<Route path="*" component={NotFound404}/>
					</Route>
				</Router>
			</Device>
			, document.getElementById("app"));
	});
});

//=================HMR Management=======================
if (module.hot) {
	module.hot.dispose(function () {
		$("#app").remove();
	});
	module.hot.accept();
}
