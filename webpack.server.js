/**
 * Created by singgum3b on 12/29/15.
 */
"use strict";

var webpack = require("webpack");
var path = require("path");

var babelSettings = {
	presets: ["es2015", "stage-0"]
};

module.exports = function (settings) {
	let mode = settings.mode;
	let isProd = (settings.mode == "production");

	return {
		target: "node",
		//devtool: "source-map",
		watch: true,
		output: {
			path: "./platform/.external-build/server/",
			filename: "[name].js"
		},
		entry: {
			server: ["./source/server/entry"]
		},
		resolve: {
			// Tell webpack to look for required files in bower and node
			modulesDirectories: ["custom_modules", "node_modules", "source/server"]
		},
		resolveLoader: {
			modulesDirectories: ["custom_modules", "node_modules"]
		},
		externals: [
				//Fix require in Meteor env
			function(context, request, callback) {
				try {
					require.resolve(path.resolve(context , request));
					callback();
				} catch(e) {
					//module load from others context , core or node_module is wrapped with Npm require
					callback(null, `Npm.require("${request}")`);
				}
			}
		],
		module: {
			preLoaders: [
				{test: /\.css?$/, loader: 'source-map'}
			],
			loaders: [
				{ test: /\.htm/, loader: "html" },
				{ test: /\.js?$/, loader: "babel", query: babelSettings, exclude: /node_modules/ },
				{ test: /\.css$/, loader: "style?sourceMap!css?sourceMap" },
				{ test: /\.(png|gif|jpe?g|ico)(\?.*)?$/, loader: "url?limit=8182" },
				{ test: /\.(svg|ttf|woff|eot)(\?.*)?$/, loader: "file" }
			],
			postLoaders: [
				{test: /linebreak/, loader: "transform?brfs"}
			],
			noParse: /\.min\.js/
		},
		plugins: [
			new webpack.DefinePlugin({
				"process.env": {
					"NODE_ENV": JSON.stringify(isProd ? "production" : "development"),
					"REMOTE": settings.remote
				}
			}),
			new webpack.optimize.DedupePlugin(),
			new webpack.SourceMapDevToolPlugin(
					'[file].map', null,
					"[absolute-resource-path]", "[absolute-resource-path]")
		]
	}
};
