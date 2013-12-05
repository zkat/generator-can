var Q = require("q"),
	path = require("path"),
	fs = require("fs"),
	fs2 = require("fs2"),
	exec = require("child_process").exec,
	mkdir = Q.denodeify(fs2.mkdir);

module.exports = function(grunt) {
	grunt.registerMultiTask('build', 'Run the existing build script from the shell.', function() {
		var done = this.async(),
			options = this.options(),
			data = this.data,
			deferred = Q.defer(),
			buildDir = grunt.config("buildDir"),
			targetDir = data.targetDir,
			targets = {
				js: path.join(buildDir, data.targets.js || 'production.js'),
				css: path.join(buildDir, data.targets.css || 'production.css')
			},
			unlink = Q.denodeify(fs.unlink),
			command = [options.steal,
					   options.buildjs,
					   data.entryPoint
					  ].concat(
						  data.to ? ["-to", data.to] : []
					  ).join(" ");

		var child = exec(command, function(error) {
			error ? deferred.reject(error) : deferred.resolve();
		});
		grunt.log.writeln('This might be a good time to get a cup of coffee.');

		var buildFailed = false;
		if(options.log) {
			child.stdout.setEncoding('utf8');
			child.stdout.on('data', function(chunk) {
				if(/^[^+]*error/i.test(chunk)) {
					// spit out errors
					grunt.log.verbose.or.error(chunk);
					buildFailed = true;
				} else if(/production\.js/.test(chunk)) {
					// let the user know when steal is almost done
					grunt.log.verbose.or.write('\n');
					grunt.log.ok('Writing production.js and production.css.');
				}

				grunt.verbose.write(chunk);
				if (/\+ /.test(chunk)) {
					grunt.verbose.or.write('.');
				}
			});
		}

		deferred.promise.then(function() {
			if (buildFailed) {
				grunt.warn("Build failed.");
			}
		}).then(function() {
			return mkdir(path.dirname(targets.js), {intermediate: true});
		}).then(function() {
			return Q.nfcall(exec, [
				"cat",
				options.productionSteal,
				path.join(data.to, "production.js"),
				">", targets.js
			].join(" "));
		}).then(function() {
			return unlink(path.join(data.to, "production.js"));
		}).then(function() {
			return mkdir(path.dirname(targets.css), {intermediate: true});
		}).then(function() {
			// TODO - if there's no less in the project, this file is never
			//        created.
			return fs2.copy(path.join(data.to, "production.css"),
							targets.css);
		}).then(function() {
			return unlink(path.join(data.to, "production.css"));
		}).then(function() {
			done();
		}, function(error) {
			grunt.log.verbose.error(error);
			done(false);
		});
	});
};
