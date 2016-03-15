var ip = require("ip"),
		minimist = require("minimist");

//==================Argv==============================================
var knownOptions = {
	boolean: ["local","remote"],
	default: {
		local: true,
		remote: false
	},
	alias: {
		local: "L",
		remote: "R"
	}
};

var CLIOptions = minimist(process.argv.slice(2),knownOptions);
//==================Argv==============================================

module.exports ={
	browserSupports: [
		"last 2 Chrome versions",
		"ff >= 25",
		"last 2 iOS versions",
		"last 2 Safari versions",
		"ie >= 10"
	],
	dev: {
		mode: "development",
		hostname: ip.address(),
		publicPath : "/assets/",
		devport: "8080",
		webport: "3000",
		debugport: "8088",
		devhost: `http://${ip.address()}:8080`,
		remote: CLIOptions.remote
	},
	prod: {
		mode: "production",
		buildFolder: "./platform/.external-build/",
		hostname: ip.address(),
		host: `http://${ip.address()}:3000`,
		publicPath : "/assets/",
		webport: "3000"
	}
};
