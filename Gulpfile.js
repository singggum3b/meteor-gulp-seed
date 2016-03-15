"use strict";

var gulp = require("gulp"),
		shell = require('gulp-shell'),
		opn = require('opn'),
		gutil = require("gulp-util"),
		stylus = require("gulp-stylus"),
		autoprefixer = require("autoprefixer"),
		poststylus = require("poststylus"),
		csswring = require("csswring"),
		path = require("path"),
		sourcemaps = require("gulp-sourcemaps"),
		filter = require("gulp-filter"),
		webpack = require("webpack"),
		WebpackDevServer = require("webpack-dev-server"),
		settings = require("./settings"),
		stylint = require("gulp-stylint"),
		gulpEslint = require("gulp-eslint"),
		del = require("del"),
		fs = require("fs"),
		I = require("immutable"),
		util = require("./util");

//==============Linting=================================================
gulp.task("lint.css", function (cb) {
	gulp.src("./source/**/*.styl")
			.pipe(stylint({
				reporter: {
					reporter: "stylint-stylish",
					reporterOptions: {
						verbose: true
					}
				}
			}))
			.pipe(stylint.reporter());
	cb();
});

gulp.task("lint.js", function (cb) {
	return gulp.src("./source/**/*.js")
			.pipe(gulpEslint())
			.pipe(gulpEslint.format());
	cb();
});

gulp.task("lint", ["lint.css", "lint.js"]);

//==============CSS===================================================
gulp.task("dev.css", function (cb) {
	//Must resolve path to have proper sourcemap
	let sourceRoot = path.join(__dirname, "source/client/stylus");
	gulp.src("./source/client/stylus/**.styl", {base: sourceRoot})
			.pipe(sourcemaps.init())
			.pipe(filter(["**/style.styl"]))
			.pipe(stylus({
				"include css": true,
				paths: ["node_modules"],
				filename: "style.styl",
				use: [require("kouto-swiss")(), poststylus([autoprefixer({browsers: settings.browserSupports})])]
			}))
			.pipe(sourcemaps.write(".", {sourceRoot: sourceRoot}))
			.pipe(gulp.dest("./source/client/.css"));
	cb();
});

gulp.task("prod.css", function (cb) {
	let sourceRoot = path.join(__dirname, "source/client/stylus");
	gulp.src("./source/client/stylus/style.styl", {base: sourceRoot})
			.pipe(stylus({
				"include css": true,
				paths: ["node_modules"],
				filename: "style.styl",
				use: [require("kouto-swiss")(), poststylus([autoprefixer({browsers: settings.browserSupports}), csswring({
					map: false,
					preserveHacks: true
				})])]
			}))
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
	//util.fancy.compiler(serverCompiler);
	util.fancy.compiler(clientCompiler);
	//Register to buildStats services
	util.buildStats.register(clientCompiler, Object.assign({}, settings, {
		mode: "development",
		target: "web",
		watch:true,
		location: "web",
		URL: settings.dev.devhost + settings.dev.publicPath
	}));

	util.buildStats.register(serverCompiler, Object.assign({}, settings, {
		mode: "development",
		watch: true,
		target: "server",
		location: "localfile",
		URL: path.join(__dirname, serverCompiler.outputPath)
	}));

	serverCompiler.watch({}, function (err, stat) {
		//console.log(err,stat);
	});

	new WebpackDevServer(clientCompiler, {
		hot: true,
		noInfo: true,
		stats: {colors: true},
		watch:true,
		headers: {
			"Access-Control-Allow-Origin": `http://${settings.dev.hostname}:${settings.dev.webport}`,
			"Access-Control-Allow-Credentials" :true
		},
		publicPath: settings.dev.publicPath
	}).listen(settings.dev.devport, settings.dev.hostname, function (err) {
		if (err) {
			console.log(gutil.colors.magenta.bold.inverse(err));
			throw new gutil.PluginError("webpack-dev-server", err);
		}
		// Server listening
		console.log(gutil.colors.magenta.bold.inverse(`[Webpack:] Build server started : ${settings.dev.devhost} \n`));
		// keep the server alive or continue?
		// callback();
	});
});

gulp.task("prod.webpack", ["prod.css"], function () {
	// Start a webpack-dev-server
	let clientCompiler = webpack(require("./webpack.client.js")(settings.prod));
	let serverCompiler = webpack(require("./webpack.server.js")(settings.prod));

	//Apply some fancy stuff
	util.fancy.compiler(serverCompiler);
	util.fancy.compiler(clientCompiler);

	//Register to buildStats services
	util.buildStats.register(clientCompiler, Object.assign({}, settings, {
		mode: "production",
		target: "web",
		location: "localfile",
		publicPath: settings.prod.publicPath,
		URL: path.join(__dirname, clientCompiler.outputPath)
	}));

	util.buildStats.register(serverCompiler, Object.assign({}, settings, {
		mode: "production",
		target: "server",
		location: "localfile",
		URL: path.join(__dirname, serverCompiler.outputPath)
	}));

	serverCompiler.run(function (err, stat) {
		if (!err) {
			util.fancy.log(gutil.colors.magenta.bold.inverse(`\nServer build completed\n`));
		} else {
			throw new Error(err);
		}
	});

	clientCompiler.run(function (err, stat) {
		if (!err) {
			util.fancy.log(gutil.colors.magenta.bold.inverse(`\nClient build completed\n`));
		} else {
			throw new Error(err);
		}
	});

});

//==============Build task===================================================
gulp.task("dev", ["dev.css", "watch.css", "dev.webpack"]);
gulp.task("prod", ["prod.css", "prod.webpack"]);

//==============Debug task===================================================

gulp.task("dbg.meteor", shell.task(["cd platform && meteor"], {
	env: {
		NODE_ENV: "development",
		NODE_OPTIONS: `--debug-brk`,
		ROOT_URL: `http://${settings.dev.hostname}:${settings.dev.webport}`
	}
}));

gulp.task("dbg.inspector", shell.task([`node-inspector -p ${settings.dev.debugport} --web-host ${settings.dev.hostname}`]));

gulp.task("dbg.openbrowser", function (cb) {
	opn(`http://${settings.dev.hostname}:${settings.dev.debugport}/?ws=${settings.dev.hostname}:${settings.dev.debugport}&port=5858`);
	opn(`http://${settings.dev.hostname}:${settings.dev.webport}`);
	cb();
});

gulp.task("debug", ["dbg.meteor", "dbg.inspector", "dbg.openbrowser"]);

//================Development task==========================================

gulp.task("dev.meteor", shell.task([
	"cd platform && meteor"
], {
	env: {
		NODE_ENV: "development",
		ROOT_URL: `http://${settings.dev.hostname}:${settings.dev.webport}`
	}
}));

gulp.task("dev.openbrowser", function (cb) {
	opn(`http://${settings.dev.hostname}:${settings.dev.webport}`);
	cb();
});

gulp.task("development", ["dev","dev.meteor", "dev.openbrowser"]);

//================Production task===========================================

gulp.task("prod.meteor", shell.task([
	"cd platform && meteor --production"
], {
	env: {
		NODE_ENV: "production"
	}
}));

gulp.task("production", ["prod.meteor"]);

//==============Gulp task isomorphic============================================

gulp.task("isomorphic.babel", function (cb) {
	// Start a webpack-dev-server
	let clientCompiler = webpack(Object.assign({},require("./webpack.isomorphic.js")(settings.prod),{
		output: {
			path: "build/isomorphic",
			filename: "[name].js",
			library: "App",
			libraryTarget: "commonjs2"
		},
		target: "node"
	}));

	//Apply some fancy stuff
	util.fancy.compiler(clientCompiler);

	clientCompiler.run(function (err, stat) {
		cb();
		if (!err) {
			util.fancy.log(gutil.colors.magenta.bold.inverse(`\nClient build completed.\n`));
		} else {
			throw new Error(err);
		}
	});

});

gulp.task("isomorphic",["isomorphic.babel"], function () {

	util.fancy.log(gutil.colors.magenta.bold.inverse(`\nRendering isomorphic..\n`));

	let React = require("react");
	let ReactDOMServer = require("react-dom/server");
	let jsdom = require("jsdom");

	//Polyfill window==========================================
	jsdom.env("<html><body></body></html>", function (err, window) {

		let element = require("./build/isomorphic/main.js")(window);
		let output = ReactDOMServer.renderToStaticMarkup(element);

		require('fs').writeFileSync("./build/isomorphic/index.html", output, "utf8");

		util.fancy.log(gutil.colors.magenta.bold.inverse(`\nRendering completed.\n`));

	});

});

//==============Gulp task static============================================
gulp.task("static.clean", function (cb) {
	del.sync([
		"build/static/**/*"
	]);
	cb();
});


gulp.task("static.babel",["static.clean"], function (cb) {
	// Start a webpack-dev-server
	let clientCompiler = webpack(require("./webpack.static.js")(settings.prod));

	//Apply some fancy stuff
	util.fancy.compiler(clientCompiler);

	clientCompiler.run(function (err, stat) {
		cb();
		if (!err) {
			util.fancy.log(gutil.colors.magenta.bold.inverse(`\nClient build completed.\n`));
		} else {
			throw new Error(err);
		}
	});

});

gulp.task("static",["static.clean","static.babel"], function () {

	util.fancy.log(gutil.colors.magenta.bold.inverse(`\nRendering static..\n`));

	let React = require("react");
	let ReactDOMServer = require("react-dom/server");
	let jsdom = require("jsdom");
	let setups = I.fromJS(require("./source/static/setup"));

	//Polyfill window==========================================
	jsdom.env({
		html: "<html><body></body></html>",
		url: "http://localhost",
		done: function (err, window) {

			let element = require("./build/static/assets/static.js");
			setups.get("route").map(function (value,index) {
				window.location.href = value.get("URL");
				window.document.title = value.get("name");
				let output = ReactDOMServer.renderToStaticMarkup(element(window));
				fs.writeFileSync(`./build/static/${value.get("name")}.html`, output, "utf8");

			});

			util.fancy.log(gutil.colors.magenta.bold.inverse(`\nRendering completed.\n`));

		}
	});

});
