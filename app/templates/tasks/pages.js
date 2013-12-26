var Q = require("q"),
	path = require("path"),
	fs = require("fs"),
	fs2 = require("fs2"),
	mkdir = Q.denodeify(fs2.mkdir);

module.exports = function(grunt) {
	grunt.registerMultiTask('pages', 'Create the appropriate app file.', function() {
		var done = this.async(),
			data = this.data,
			buildDir = grunt.config("buildDir");

		function writePageFile(srcFile, dstFile, hrefs) {
			return Q.nfcall(fs.readFile, srcFile).then(function(fileHtml) {
				var fileText = fileHtml.toString();
				return fileText.replace(
						/<script[^">]*"..\/steal\/steal.js[^>]*>[^<]*<\/script>/,
					'<script src="'+hrefs.js+'" type="text/javascript"></script>'
				).replace(
					'</head>',
					'<link rel="stylesheet" href="'+hrefs.css+'">' +
						'<script type="text/javascript" charset="utf-8">' +
						'steal='+JSON.stringify({
							env: "production",
							completed: ["src/production.js", "src/production.css"]
						}) + ";" +
						'</script>\n</head>'
				);
			}).then(function(newText) {
				return Q.nfcall(fs.writeFile, dstFile, newText);
			}).then(function success() {
				grunt.log.ok("Wrote " + dstFile + ".");
			}, function fail(err) {
				grunt.log.error("Could not write " + dstFile + ": " + err);
			});
		}

		mkdir(buildDir, {intermediate: true}).then(function() {
			return Q.all(data.files.map(function(page) {
				return writePageFile(
					page.src[0], path.join(buildDir, page.dest), page.hrefs);
			}));
		}).then(function() {
			done();
		}, function(err) {
			grunt.log.verbose.error(err);
			done(false);
		});
	});
};
