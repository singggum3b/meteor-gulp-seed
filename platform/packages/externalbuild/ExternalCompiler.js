/**
 * Created by singgum3b on 12/29/15.
 */
//================================================
let I = Npm.require("immutable");
let fs = Npm.require("fs");
let colors = Npm.require("chalk");
colors.enabled = true;


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
					try {
						files[0].addJavaScript({
							path: f,
							data: fs.readFileSync(buildInfo.getIn(["meta", "URL"]) + f, "utf8"),
							sourceMap: JSON.parse(fs.readFileSync(buildInfo.getIn(["meta", "URL"]) + f + ".map", "utf8"))
						})
					} catch (e) {
						console.log("Localfile not found: " + buildInfo.getIn(["meta", "URL"]) +f );
					}
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
function processProduction(files,buildInfo) {
	let _production = I.fromJS(buildInfo.production);
	let _architect = files[0].getArch();
	_architect = _architect.indexOf("cordova") > -1 ? "cordova" : _architect.indexOf("web") > -1 ? "web" : "server";
	_production.map(function (buildInfo,buildTarget) {
		//console.log(buildTarget,_architect);
		if (buildTarget == _architect) {
			mdx(_architect,{
				"web":()=> {
					buildInfo.getIn(["meta","location"]) == "localfile" ? addFileLocal(files,buildInfo) : includeFileRemote(files,buildInfo);
				},
				"server": ()=>{
					buildInfo.getIn(["meta","location"]) == "localfile" ? addFileLocal(files,buildInfo) : includeFileRemote(files,buildInfo);
				}
			});
		}
	});
}

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

	constructor() {
		this.runMode = I.fromJS(process.argv).filter((value)=>value.toLowerCase() == "--production").size >= 1  ? "production" : "development";
	}

	processFilesForTarget(files) {
		if (files.length !== 1) throw new Error("You must have only 1 external-build.json file");
		var buildInfo = JSON.parse(files[0].getContentsAsString());

		if (this.runMode == "development" && buildInfo.development) {
			processDevelopment(files,buildInfo);
		} else if (this.runMode == "production" && buildInfo.production) {
			processProduction(files,buildInfo);
		} else {
			throw new Error(colors.red.bold("Run mode & external-config.json data mismatch : Not found"));
		}

	}

};
