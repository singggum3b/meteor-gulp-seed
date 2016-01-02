//====================================================
//Manually optimize bundle - move common module to entry chunk
require.include("js/data/bag-data");

//====================================================
const {IndexRoute, Route} = ReactRouter;

//=====================================================
//Vector
window.DEVICE = ["phone", "tablet", "desktop"];

//=============================================
let DeviceList = [
	{name: "phone", breakpoint: 640},
	{name: "tablet", breakpoint: 960},
	{name: "desktop", breakpoint: Infinity}
];

//===============================PRELOAD ASSETS==============
require.ensure([], function (require) {
	var MediaStore = require("js/media");
	var ImgLoaded = Immutable.fromJS([]);
	var PreloadList = require("js/data/bag-data").ImageList;

	PreloadList.map(function (img, index) {
		function requested() {
			ImgLoaded = ImgLoaded.push(img);
			console.log(ImgLoaded.size, PreloadList.size);
			if (ImgLoaded.size == PreloadList.size) {
				MediaStore.actions.imagesLoaded();
			}
		}

		var _img = (new Image());
		_img.onerror = requested;
		_img.onload = requested;
		return _img.src = require("../img/" + img.replace(/^\//,""));
	});
});

//=====================APP=======================
require.ensure([], function (require) {
	var {Router,Route,IndexRoute}= ReactRouter;
	var Device = require("js/components/device");
	var MasterPage = require("js/pages/master.js"),
			IndexPage = require("js/pages/index.js"),
			SubmitPage = require("js/pages/submit.js");

	$(()=> {
		$(document.body).append(`<div id="app"></div>`);
		ReactDOM.render(
				<Device className="v-coach-app"
								device={DeviceList}>
					<Router history={History.createHistory()}>
						<Route path="/" component={MasterPage}>
							<IndexRoute component={IndexPage}/>
							<Route path="/bag/:size" component={IndexPage}>
								<Route path="submit" component={SubmitPage}>
								</Route>
							</Route>
						</Route>
					</Router>
				</Device>
				, document.getElementById("app"));
	})
});

//=================HMR Management=======================
if (module.hot) {
	module.hot.dispose(function() {
		$("#app").remove();
	});
	module.hot.accept();
}
