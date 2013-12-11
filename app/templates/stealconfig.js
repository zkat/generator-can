steal.config({
	map: {
		"*": {
			"jquery/jquery.js" : "jquery",
			"can/util/util.js": "can/util/jquery/jquery.js",
			"funcunit/funcunit.js": "test/funcunit/funcunit.js",
			"qunit/qunit.js": "test/funcunit/qunit/qunit.js"
		}
	},
	paths: {
		"qunit": "test/funcunit/qunit/qunit.js",
		"funcunit": "test/funcunit/funcunit.js",
		"can/": "bower_components/canjs/",
		"jquery": "bower_components/canjs/lib/jquery.1.9.1.js"
	},
	shim : {
		jquery: {
			exports: "jQuery"
		}
	},
	ext: {
		js: "js",
		css: "css",
		less: "steal/less/less.js",
		mustache: "can/view/mustache/mustache.js"
	},
	version: "development"
});
