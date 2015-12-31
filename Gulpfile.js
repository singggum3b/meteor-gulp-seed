"use strict";

var gulp = require("gulp"),
		gutil = require("gulp-util"),
		stylus = require("gulp-stylus"),
		path = require("path"),
		sourcemaps = require("gulp-sourcemaps"),
		filter = require("gulp-filter"),
		webpack = require("webpack"),
		WebpackDevServer = require("webpack-dev-server");

//==============CSS===================================================
gulp.task("dev.css", function (cb) {
	//Must resolve path to have proper sourcemap
	let sourceRoot = path.join(__dirname,"source/client/stylus");
	gulp.src("./source/client/stylus/style.styl", {base: sourceRoot})
			.pipe(sourcemaps.init())
			.pipe(filter(["**/style.styl"]))
			.pipe(stylus({
				"include css": true,
				paths: ["node_modules"],
				filename: "style.styl",
				use: [require("jeet")(), require("kouto-swiss")()]
			}))
			.pipe(sourcemaps.write(".",{sourceRoot: sourceRoot}))
			.pipe(gulp.dest("./source/client/.css"));
	cb();
});

gulp.task("watch.css",["dev.css"],function() {
	gulp.watch("./source/client/stylus/**/*.styl",["dev.css"])
});

//==============Webpack===================================================
var defaultStatsOptions = {
	colors: gutil.colors.supportsColor,
	hash: false,
	timings: false,
	chunks: false,
	chunkModules: false,
	modules: false,
	children: true,
	version: true,
	cached: false,
	cachedAssets: false,
	reasons: false,
	source: false,
	errorDetails: false
};

var encode = module.exports = function (xs) {
	function bytes (s) {
		if (typeof s === 'string') {
			return s.split('').map(ord);
		}
		else if (Array.isArray(s)) {
			return s.reduce(function (acc, c) {
				return acc.concat(bytes(c));
			}, []);
		}
	}

	return new Buffer([ 0x1b ].concat(bytes(xs)));
};

var ord = encode.ord = function ord (c) {
	return c.charCodeAt(0)
};


gulp.task("dev.webpack",["dev.css"], function () {
	// Start a webpack-dev-server
	var compiler = webpack(require("./webpack.client.js"));

	var Progressor = require('progressor');

	var progressor = new Progressor({
		format: " %current%/%max% [%bar%] %percent:3s%% %elapsed:6s%/%estimated:-6s% %memory:6s%",
		emptyBarChar: encode("[31m") + "t",
		progressChar: "[32m =",
		barChar: "[34m ="
	}, 10);



	progressor.start();

	var timer = setInterval(function () {
		progressor.advance();
		if(progressor.isComplete()) {
			progressor.finish();
			clearInterval(timer);
		}
	}, 1000);

	compiler.apply(new webpack.ProgressPlugin(function (percentage, msg) {
		//console.log(arguments);
	}));

	compiler.plugin('done', function (stats) {
		var statsOptions =  {};

		Object.keys(defaultStatsOptions).forEach(function (key) {
			if (typeof statsOptions[key] === 'undefined') {
				statsOptions[key] = defaultStatsOptions[key];
			}
		});

		gutil.log(stats.toString(statsOptions));
	});

	new WebpackDevServer(compiler, {
		hot:true,
		noInfo: true,
		stats: { colors: true },
		headers: { "Access-Control-Allow-Origin": "*" },
		publicPath: "/assets/"
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		// Server listening
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

		// keep the server alive or continue?
		// callback();
	});
});

gulp.task("dev",["dev.css","watch.css","dev.webpack"]);
