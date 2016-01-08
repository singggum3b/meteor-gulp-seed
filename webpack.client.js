"use strict";

var webpack = require("webpack"),
		ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = function (settings) {

	let isProd = (settings.mode == "production");

	var babelSettings = isProd ?
	{
		presets: ["react", "es2015", "stage-0"],
		plugins: [
			"transform-decorators-legacy"
		]
	}
			:
	{
		presets: ["react", "es2015", "stage-0"],
		plugins: [
			"transform-decorators-legacy",
			["react-transform", {
				transforms: [{
					transform: "react-transform-hmr",
					imports: ["react"],
					locals: ["module"]
				}, {
					transform: "react-transform-catch-errors",
					imports: ["react", "redbox-react"]
				}]
				// redbox-react is breaking the line numbers :-(
				// you might want to disable it
			}]]
	};

	return {
		debug: false,
		devtool: isProd ? false : "source-map",
		output: {
			path: isProd ? settings.buildFolder : "/memory/webpack",
			publicPath: settings.devhost + settings.publicPath,
			filename: "[name].js",
			hotUpdateChunkFilename: "[id].[hash].hot-update.ignore.js"
		},
		entry: {
			main: isProd ? ["./source/client/entry"] : ["./source/client/entry", `webpack-dev-server/client?${settings.devhost}`, "webpack/hot/dev-server"],
			"common-vendor": ["jquery", "react", "react-router", "react-canvas", "history", "nuclear-js"]
		},
		resolve: {
			// Tell webpack to look for required files in bower and node
			modulesDirectories: ["custom_modules", "node_modules", "source/client"]
		},
		resolveLoader: {
			modulesDirectories: ["custom_modules", "node_modules"]
		},
		externals: {},
		module: {
			preLoaders: [
				{test: /\.css?$/, loader: 'source-map'}
			],
			loaders: [
				{test: /\.htm/, loader: "html"},
				{test: /\.js?$/, loader: "babel", query: babelSettings, exclude: /node_modules/},
				{test: /\.css$/, loader: isProd ?  ExtractTextPlugin.extract("style", "css") : "style?sourceMap!css?sourceMap"},
				{test: /\.(png|gif|jpe?g|ico)(\?.*)?$/, loader: "url?limit=8182"},
				{test: /\.(svg|ttf|woff|eot)(\?.*)?$/, loader: "file"}
			],
			postLoaders: [
				{test: /linebreak/, loader: "transform?brfs"}
			],
			noParse: /\.min\.js/
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': JSON.stringify(isProd ? "production" : "development")
				}
			}),
			new webpack.PrefetchPlugin(undefined, "jquery"),
			new webpack.PrefetchPlugin(undefined, "react"),
			new webpack.PrefetchPlugin(undefined, "react-router"),
			new webpack.PrefetchPlugin(undefined, "react-canvas"),
			new webpack.PrefetchPlugin(undefined, "history"),
			new webpack.PrefetchPlugin(undefined, "nuclear-js"),
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.CommonsChunkPlugin({
				name: ["common-vendor"],
				minChunks: Infinity
			}),
			!isProd ? new webpack.HotModuleReplacementPlugin() : ()=>null,
			isProd ? new ExtractTextPlugin("styles.css") : ()=>null,
			isProd ? new webpack.optimize.OccurenceOrderPlugin(true) : ()=>null,
			isProd ? new webpack.optimize.UglifyJsPlugin({
				sourceMap: false,
				compress: {
					warnings: false,
					pure_funcs: ["console.log"]
				}
			}): ()=>null
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
