/**
 * Created by singgum3b on 12/29/15.
 */
var webpack = require("webpack");
var path = require("path");

var babelSettings = {
	presets: ["es2015", "stage-0"]
};

module.exports = function (settings) {
	return {
		debug: true,
		target: "node",
		devtool: "source-map",
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
			new webpack.optimize.DedupePlugin()
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
