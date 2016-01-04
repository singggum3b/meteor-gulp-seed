"use strict";

var I = require("immutable");
var externalBuildInfo = I.Map({});
var oldExternalBuildInfo;
var updateLock= false;
var updateQueue = I.List([]);

/*settings = Object.assign({},settings,{
	@mode: "development|production",
	@target: "web|server|cordova",
	@location: "[hostURL]|localfile"
});*/
module.exports = {
	register: function (webpackCompiler, settings) {
		return webpackCompiler.plugin('done', function (stats) {
			var buildStat = I.fromJS(stats.toJson({chunks: true}).assetsByChunkName).toList().flatten(1).toJS();

			if (settings.mode == "development") {
				updateBuildInfo(I.fromJS({
					development: {
						[settings.target]: {
							settings: settings,
							stat: buildStat,
							timeStamp: settings.watch ? Date.now() : 0
						}
					}
				}));
			} else {
				externalBuildInfo.set("production");
			}

		});
	}
};

function updateBuildInfo(newInfo) {
	if (updateLock) {
		updateQueue.push(newInfo);
	} else {
		updateLock = true;
		oldExternalBuildInfo = externalBuildInfo;
		externalBuildInfo = externalBuildInfo.mergeDeep(newInfo);
		updateLock = false;
		digest();
		if (updateQueue.size) {
			let next = updateQueue.first();
			updateQueue = updateQueue.shift();
			updateBuildInfo(next);
		}
	}
}

//Digest build info & output external.
function digest() {

	if (!I.is(oldExternalBuildInfo,externalBuildInfo)) {

		let outputBuildInfo = externalBuildInfo.map(function (modeInfo, mode) {
			return modeInfo.map(function (targetInfo,target) {
				return {
					meta: {
						location: targetInfo.getIn(["settings","location"]),
						URL: targetInfo.getIn(["settings","URL"]),
						timeStamp: targetInfo.getIn(["timeStamp"])
					},
					data: {
						css: targetInfo.get("stat").filter(function (value, index) {
							return /\.css$/.test(value);
						}).toJS(),
						js:  targetInfo.get("stat").filter(function (value, index) {
							return /\.js$/.test(value);
						}).toJS()
					}
				}
			})
		});

		require('fs').writeFileSync('platform/external-build.json', JSON.stringify(outputBuildInfo));
	}

}
