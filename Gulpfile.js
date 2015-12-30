var gulp = require("gulp"),
		gutil = require("gulp-util"),
		stylus = require("gulp-stylus"),
		sourcemaps = require("gulp-sourcemaps"),
		filter = require("gulp-filter"),
		webpack = require("webpack"),
		WebpackDevServer = require("webpack-dev-server");

//==============CSS===================================================
gulp.task("dev.css", function (cb) {
	gulp.src("source/client/stylus/style.styl", {base: "source/client/stylus"})
			.pipe(sourcemaps.init())
			.pipe(filter(["style.styl"]))
			.pipe(stylus({
				"include css": true,
				paths: ["node_modules"],
				filename: "style.styl",
				use: [require("jeet")(), require("kouto-swiss")()]
			}))
			.pipe(sourcemaps.write({debug:true}))
			.pipe(gulp.dest("./source/client/.css"));
	cb();
});

gulp.task("watch.css",["dev.css"],function() {
	gulp.watch("./source/client/stylus/**/*.styl",["dev.css"])
});

//==============Webpack===================================================
gulp.task("dev.webpack",["dev.css"], function () {
	// Start a webpack-dev-server
	var compiler = webpack(require("./webpack.client.js"));

	new WebpackDevServer(compiler, {
		hot:true,
		noInfo: false,
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
