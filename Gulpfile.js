"use strict";

var gulp = require("gulp"),
		gutil = require("gulp-util"),
		stylus = require("gulp-stylus"),
		autoprefixer = require("autoprefixer"),
		poststylus = require("poststylus"),
		path = require("path"),
		sourcemaps = require("gulp-sourcemaps"),
		filter = require("gulp-filter"),
		webpack = require("webpack"),
		WebpackDevServer = require("webpack-dev-server"),
		settings = require("./settings"),
		util = require("./util");

//==============CSS===================================================
gulp.task("dev.css", function (cb) {
	//Must resolve path to have proper sourcemap
	let sourceRoot = path.join(__dirname, "source/client/stylus");
	gulp.src("./source/client/stylus/style.styl", {base: sourceRoot})
			.pipe(sourcemaps.init())
			.pipe(filter(["**/style.styl"]))
			.pipe(stylus({
				"include css": true,
				paths: ["node_modules"],
				filename: "style.styl",
				use: [require("jeet")(), require("kouto-swiss")(), poststylus([autoprefixer({browsers: settings.browserSupports})])]
			}))
			.pipe(sourcemaps.write(".", {sourceRoot: sourceRoot}))
			.pipe(gulp.dest("./source/client/.css"));
	cb();
});

gulp.task("watch.css", ["dev.css"], function () {
	gulp.watch("./source/client/stylus/**/*.styl", ["dev.css"])
});

//==============Webpack===================================================

gulp.task("dev.webpack", ["dev.css"], function () {
	// Start a webpack-dev-server
	let clientCompiler = webpack(require("./webpack.client.js")(settings.dev));
	let serverCompiler = webpack(require("./webpack.server.js")(settings.dev));

	//Apply some fancy stuff
	util.fancy.compiler(serverCompiler);
	util.fancy.compiler(clientCompiler);
	//Register to buildStats services
	util.buildStats.register(clientCompiler,Object.assign({},settings,{
		mode: "development",
		target: "web",
		location: "web",
		URL: settings.dev.host + settings.dev.publicPrefix
	}));

	util.buildStats.register(serverCompiler,Object.assign({},settings,{
		mode: "development",
		watch: true,
		target: "server",
		location: "localfile",
		URL: path.join(__dirname,serverCompiler.outputPath)
	}));

	serverCompiler.watch({},function (err,stat) {
		//console.log(err,stat);
	});

	new WebpackDevServer(clientCompiler, {
		hot: true,
		noInfo: true,
		stats: {colors: true},
		headers: {"Access-Control-Allow-Origin": "*"},
		publicPath: settings.dev.publicPrefix
	}).listen(settings.dev.port, settings.dev.hostname, function (err) {
		if (err) {
			console.log(gutil.colors.magenta.bold.inverse(err));
			throw new gutil.PluginError("webpack-dev-server", err);
		}

		// Server listening
		console.log(gutil.colors.magenta.bold.inverse(`[Webpack:] Build server started : ${settings.dev.host} \n`));

		// keep the server alive or continue?
		// callback();
	});
});

gulp.task("dev", ["dev.css", "watch.css", "dev.webpack"]);
