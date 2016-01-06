/**
 * Created by singgum3b on 12/29/15.
 */
//================================================
let I = Npm.require("immutable");
let fs = Npm.require("fs");

//================================================
mdx = function Match(deviceName, map) {
	var result = I.fromJS(map).find((val, key)=> deviceName == key);
	return result ? result() : undefined;
};

//=============UTILITY===================================
function addFileLocal(files,buildInfo) {
	buildInfo.get("data").map(function (fileslist,type) {
		mdx(type,{
			"js": function () {
				fileslist.map((f)=>{
					files[0].addJavaScript({
						path: f,
						data: fs.readFileSync(buildInfo.getIn(["meta","URL"]) + f,"utf8"),
						sourceMap: JSON.parse(fs.readFileSync(buildInfo.getIn(["meta","URL"]) + f + ".map","utf8"))
					})
				});
			}
		});
	});
}

function addFileRemote(files,buildInfo) {
	buildInfo.get("data").map(function (fileslist,type) {
		mdx(type,{
			"css": function () {
				fileslist.map((f)=>files[0].addHtml({
					section: "head",
					data: `<link rel="stylesheet" type="text/css" href=${buildInfo.getIn(["meta","URL"]) + f} />`
				}));
			},
			"js": function () {
				fileslist.map((f)=>files[0].addHtml({
					section: "head",
					data: `<script src=${buildInfo.getIn(["meta","URL"]) + f} type="text/javascript"></script>`
				}));
			}
		});
	});
}

//=============PRODUCTION===================================

//=============DEVELOPMENT===================================
function processDevelopment(files,buildInfo) {
	let _development = I.fromJS(buildInfo.development);
	let _architect = files[0].getArch();
	_architect = _architect.indexOf("cordova") > -1 ? "cordova" : _architect.indexOf("web") > -1 ? "web" : "server";
	_development.map(function (buildInfo,buildTarget) {
		//console.log(buildTarget,_architect);
		if (buildTarget == _architect) {
			mdx(_architect,{
				"web":()=> {
					buildInfo.getIn(["meta","location"]) == "localfile" ? addFileLocal(files,buildInfo) : addFileRemote(files,buildInfo);
				},
				"server": ()=>{
					buildInfo.getIn(["meta","location"]) == "localfile" ? addFileLocal(files,buildInfo) : addFileRemote(files,buildInfo);
				}
			});
		}
	});
}

//================================================
ExternalCompiler = class ExternalCompiler {

	processFilesForTarget(files) {
		if (files.length !== 1) throw new Error("You must have only 1 external-build.json file");
		var buildInfo = JSON.parse(files[0].getContentsAsString());

		if (!!buildInfo.development) {
			processDevelopment(files,buildInfo);
		} else if (buildInfo.production) {

		}

	}

};
