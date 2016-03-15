"use strict";

var webpack = require("webpack"),
		path = require("path"),
		//Exclude node_modules
		externals = require("fs").readdirSync('node_modules').filter(function(x) { return x !== '.bin' }),
		ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function (settings) {

	let isProd = (settings.mode == "production");

	var babelSettings = {
		presets: ["react", "es2015", "stage-0"],
		plugins: [
			"transform-decorators-legacy"
		]
	};

	return {
		devtool: false,
		output: {
			path: "build/static/assets",
			filename: "[name].js",
			library: "App",
			libraryTarget: "commonjs2",
			publicPath: "assets/"
		},
		target: "node",
		entry: {
			static: ["./source/static"]
		},
		resolve: {
			// Tell webpack to look for required files in bower and node
			modulesDirectories: ["custom_modules", "node_modules", "source"]
		},
		resolveLoader: {
			modulesDirectories: ["custom_modules", "node_modules"]
		},
		externals: externals,
		module: {
			preLoaders: [
				{test: /\.css?$/, loader: 'source-map'}
			],
			loaders: [
				{test: /\.htm/, loader: "html"},
				{test: /\.js?$/, loader: "babel", query: babelSettings, exclude: /node_modules/},
				{test: /\.css$/, loader: "css"},
				{test: /\.(png|gif|jpe?g|ico)(\?.*)?$/, loader: "url?limit=8182"},
				{test: /\.(svg|ttf|woff|eot)(\?.*)?$/, loader: "file"}
			],
			postLoaders: [
				{test: /linebreak/, loader: "transform?brfs"}
			],
			noParse: /\.min\.js/
		},
		plugins: [
			new webpack.optimize.DedupePlugin(),
			new webpack.DefinePlugin({
				"DEVICE": `window.DEVICE`,
				"History": `window.History`,
				"React" : `window.React`,
				"Request": `window.Request`,
				"Immutable": `window.Immutable`,
				"ReactRouter": `window.ReactRouter`,
				"Nuclear": `window.Nuclear`,
				"ReactCSSTransitionGroup": `window.ReactCSSTransitionGroup`,
				"cx": `window.cx`,
				"$": `window.$`,
				"navigator": `window.navigator`,
				'process.env': {
					'NODE_ENV': JSON.stringify(isProd ? "production" : "development")
				}
			})
			/*{
			 //Output stats
			 apply: function(compiler) {
			 compiler.plugin("after-emit", function(compilation, done) {
			 var stats = compilation.getStats().toJson();
			 require("fs").writeFile("webpack.stats.json", JSON.stringify(stats), done);
			 });
			 }
			 }*/
		]
	}
};
