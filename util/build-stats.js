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

			//ignore none emitted chunk & chunks marked as ignored
			let _stat = stats.toJson({
				hash: false,
				timings: false,
				chunks: false,
				chunkModules: true,
				modules: false,
				children: true,
				version: true,
				cached: false,
				cachedAssets: false,
				reasons: true,
				source: false,
				errorDetails: true
			});

			let assetsByChunkName = I.fromJS(_stat.assetsByChunkName).toList().flatten().map(function (name,index) {
				return I.fromJS({
					name: name,
					emitted: true,
					chunkNames: [name]
				})
			});

			let assets = I.fromJS(_stat.assets);

			//Merge assets output
			let buildStat = assets.concat(assetsByChunkName.filterNot(function (val) {
				return assets.some(function (v) {
					return v.get("name") == val.get("name");
				})
			})).filter(value=>{
				return (value.get("emitted") && !/\.ignore\./.test(value.get("name")));
			});

			//Do not update if build error
			if (_stat.errors.length) return;

			if (settings.mode == "development") {
				updateBuildInfo(I.fromJS({
					development: {
						[settings.target]: {
							settings: settings,
							stat: buildStat.filter((value)=>{
								return value.get("chunkNames").size || value.get("chunks").size
							}),
							timeStamp: settings.watch ? Date.now() : 0
						}
					}
				}));
			} else if(settings.mode == "production") {
				updateBuildInfo(I.fromJS({
					production: {
						[settings.target]: {
							settings: settings,
							stat: buildStat,
							timeStamp: settings.watch ? Date.now() : 0
						}
					}
				}));
			}

		});
	}
};

function deepMergeArray(prev,next) {
	if (I.List.isList(prev) && I.List.isList(next)) {
		return prev.concat(next).toMap().mapEntries((entry)=>{
			return [entry[1].get("name"),entry[1]];
		}).toList()
	} else {
		try {
			return prev.mergeWith(deepMergeArray,next);
		} catch (e) {
			return next;
		}
	}
}

function updateBuildInfo(newInfo) {
	if (updateLock) {
		updateQueue = updateQueue.push(newInfo);
	} else {
		updateLock = true;
		oldExternalBuildInfo = externalBuildInfo;
		externalBuildInfo = externalBuildInfo.mergeWith(deepMergeArray,newInfo);
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
						timeStamp: targetInfo.getIn(["timeStamp"]),
						publicPath: targetInfo.getIn(["settings","publicPath"]) || ""
					},
					data: {
						css: targetInfo.get("stat").filter(function (value, index) {
							return /\.css$/.test(value.get("name"));
						}).map((value)=>value.get("name")).toJS(),
						js:  targetInfo.get("stat").filter(function (value, index) {
							return (/\.js$/.test(value.get("name")) && value.get("chunkNames").size);
						}).map((value)=>value.get("name")).toJS(),
						assets: targetInfo.get("stat").filter(function (value, index) {
							return !value.get("chunkNames").size;
						}).map((value)=>value.get("name")).toJS()
					}
				}
			})
		});

		require('fs').writeFileSync('platform/external-build.json', JSON.stringify(outputBuildInfo));
	}

}
