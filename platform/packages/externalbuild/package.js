Package.describe({
  name: "singgum3b:externalbuild",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Allow meteor to integrate with external build system & server",
  // URL to the Git repository containing the source code for this package.
  git: "https://github.com/singggum3b/meteor-external-build.git",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.registerBuildPlugin({
	name: "singgum3b:externalbuild",
	use: [
		"meteor",
		"ecmascript"
	],
	sources: [
		"ExternalCompiler.js",
		"externalbuild.js"
	],
	npmDependencies: {
		"immutable": "3.7.6",
		"shelljs": "0.5.3",
		"chalk": "1.1.1"
	}
});

Package.onUse(function(api) {
  api.versionsFrom("1.1");
	api.use("isobuild:compiler-plugin@1.0.0");
	api.imply("ecmascript-runtime");
});

Package.onTest(function(api) {
  api.use("ecmascript");
  api.use("tinytest");
  api.use("singgum3b:externalbuild");
  api.addFiles("externalbuild-tests.js");
});
