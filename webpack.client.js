var webpack = require("webpack"),
		ExtractTextPlugin = require("extract-text-webpack-plugin");

var babelSettings = {
	presets: ["react", "es2015", "stage-0"],
	cacheDirectory: undefined,
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

module.exports = function (settings) {
	return {
		debug: false,
		devtool: "source-map",
		output: {
			path: "/memory/webpack",
			publicPath: settings.host + settings.publicPrefix,
			filename: "[name].js"
		},
		entry: {
			main: ["./source/client/entry",`webpack-dev-server/client?${settings.host}`, "webpack/hot/dev-server"],
			"common-vendor": ["jquery","react","react-router","react-canvas","history","nuclear-js"]
		},
		resolve: {
			// Tell webpack to look for required files in bower and node
			modulesDirectories: ["custom_modules", "node_modules", "source/client"]
		},
		resolveLoader: {
			modulesDirectories: ["custom_modules", "node_modules"]
		},
		externals: {
		},
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
			new webpack.HotModuleReplacementPlugin()
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
