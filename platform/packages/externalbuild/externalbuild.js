// Write your package code here!
Plugin.registerCompiler({
	filenames: ["external-build.json"]
}, function () {
	return new ExternalCompiler();
});
