/* ONLY FANCY STUFF*/

var Progressor = require('progressor').Progressor;
var progressor,
		webpack = require("webpack"),
		gutil = require("gulp-util");

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
	errorDetails: true
};

module.exports = {
	log(msg) {
		progressor && progressor.log(msg);
	},
	compiler(webpackCompiler) {

		webpackCompiler.apply(new webpack.ProgressPlugin(require("throttle-debounce").debounce(0,function (percentage, msg) {
			if (!progressor) {
				this.progressor = progressor = new Progressor({
					format: " «╣%bar%╠» " + " %message% ".magenta.bold + " %percent:3s%%".bold.green.dim + " Memory %memory:6s%".red.bold,
					emptyBarChar: "▒".gray,
					progressChar: "█".red.dim,
					barChar: "█".green.dim,
					overwrite: true
				}, 100);
				this.progressor.setMessage("Build..");
				this.progressor.start();
			} else if (!progressor.started || progressor.isComplete()) {
				this.progressor.setMessage("Build..");
				this.progressor.start();
			}

			if (percentage > progressor.percent) {
				percentage = (percentage == 0.7) ? (progressor.percent > 0.2 ? progressor.percent : 0.2) : percentage;
				if (percentage == 1) {
					progressor.finish();
					progressor.clear();
					console.log("===========Build process(s) completed============".black.bold);
				} else {
					this.progressor.setProgress(percentage*100);
					this.progressor.setMessage(msg);
				}
			} else {
				this.progressor.setMessage(msg);
				this.progressor.display();
			}

		}),true));

		webpackCompiler.plugin('done', function (stats) {
			var statsOptions =  {};

			Object.keys(defaultStatsOptions).forEach(function (key) {
				if (typeof statsOptions[key] === 'undefined') {
					statsOptions[key] = defaultStatsOptions[key];
				}
			});

			progressor.log(stats.toString(statsOptions));

		});
	}
};

if (process.platform === "win32") {
	require("readline")
			.createInterface({
				input: process.stdin,
				output: process.stdout
			})
			.on("SIGINT", function () {
				process.emit("SIGINT");
			});
}

process.on("SIGINT", ()=> {
	// graceful shutdown
	console.log(`

(ノಠ益ಠ)ノ彡 ┻━┻
░░░░░░░░▄▄██▀▀▀▀▀▀▀████▄▄▄▄░░░░░░░░░░░░░
░░░░░▄██▀░░░░░░░░░░░░░░░░░▀▀██▄▄░░░░░░░░
░░░░██░░░░░░░░░░░░░░░░░░░░░░░░▀▀█▄▄░░░░░
░░▄█▀░░░░░░░░░░░░░░░░░░░░░░░░░░░░▀▀█▄░░░
░▄█▀░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█▄░░
░█▀░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▀█░
▄█░░░░░░░░░░░░░░░░░░▄░░░░░░░░░░░░░░░░░██
█▀░░░░░░██▄▄▄▄▄░░░░▄█░░░░░░░░░░░░░░░░░░█
█░░░░░░░█▄░░▀██████▀░░░▄▄░░░░░░░░░░██░░█
█░░░░░░░░▀█▄▄▄█▀░░░░░░░██▀▀██▄▄▄▄▄▄█░░▄█
█░░░░░░░░░░░░░░░░░░░░░░░▀▄▄▄▀▀▀██▀░░░░█▀
█▄░░░░░▄▄░░░░░░░░░░░░░░░░░░▀▀▀▀▀░░░░▄█▀░
░█▄░░░░█░░░░▄▄▄▄░░░░░░░░░░░░░░░░░░░▄█░░░
░░█▄░░▀█▄░░▀▀▀███████▄▄▄░░░▄░░░░░▄█▀░░░░
░░░█▄░░░░░░░░░░░░░▀▀▀░░█░░░█░░░░██░░░░░░
░░░░▀█▄▄░░░░░░░░░░░░░░░░░██░░░▄█▀░░░░░░░
░░░░░░▀▀█▄▄▄░░░░░░░░░░░░░▄▄▄█▀▀░░░░░░░░░
░░░░░░░░░░▀▀█▀▀███▄▄▄███▀▀▀░░░░░░░░░░░░░
░░░░░░░░░░░█▀░░░░░░░░░░░░░░░░░░░░░░░░░░░

	`.red.bold.dim);

	process.exit();
});

