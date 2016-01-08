var ip = require("ip");

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
		host: `http://${ip.address()}:8080`,
		publicPrefix : "/assets/",
		port: "8080"
	},
	prod: {
		mode: "production",
		buildFolder: "./platform/.external-build/",
		hostname: ip.address(),
		host: `http://${ip.address()}:3000`,
		publicPath : "/assets/",
		port: "3000"
	}
};
