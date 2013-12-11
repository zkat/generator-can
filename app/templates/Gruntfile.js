var execSync = require("exec-sync");

module.exports = function(grunt) {

// External tasks
grunt.loadNpmTasks("grunt-contrib-jshint");
grunt.loadNpmTasks("grunt-contrib-copy");
grunt.loadNpmTasks("grunt-contrib-clean");
grunt.loadNpmTasks("grunt-contrib-compress");
grunt.loadNpmTasks("grunt-contrib-connect");
grunt.loadNpmTasks("grunt-shell");
grunt.loadNpmTasks("testee");

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

	mainPage: "app",
	buildDir: "./build",
	version: execSync("git describe --always --tag"),

	clean: ["<%= buildDir %>", "<%= mainPage %>.tgz"],

	testee: {
		local: {
			options: {
				urls: ['http://localhost:8125/test/test.html'],
				browsers: ["phantom"]
			}
		}
	},

	connect: {
		server: {
			options: {
				port: 8125,
				directory: "./",
				debug: true
			}
		}
	},

	compress: {
		main: {
			options: {
				archive: "<%= mainPage %>.tgz",
				mode: "tgz",
				pretty: true
			},
			files: [
				{
					expand: true,
					src: ["**"],
					cwd: "build/",
					// NOTE - Change this to just be "/" to get rid of the
					//        app/ directory inside the tarball.
					dest: "<%= mainPage %>/"
				}
			]
		}
	},

    build: {
        options: {
            steal: './node_modules/.bin/steal',
            buildjs: 'build',
			productionSteal: './bower_components/steal/steal.production.js',
            log: true
        },
        app: {
			entryPoint: './src/<%= mainPage %>.js',
			to: 'src',
			targets: {
				js: '<%= mainPage %>.js',
				css: '<%= mainPage %>.css'
			}
        }
    },

	pages: {
		pages: [{
			srcFile: "./src/<%= mainPage %>.html",
			dstFile: "index.html",
			hrefs: {
				js: "<%= mainPage %>.js?v=<%= version %>",
				css: "<%= mainPage %>.css?v=<%= version %>"
			}
		}]
	},

	copy: {
		main: {
			files : [{
				expand: true,
				src: ['resources/**'],
				cwd: 'src/',
				dest: '<%= buildDir %>/'
			}]
		}
	},

	jshint: {
		jshintrc: ".jshintrc",
		files: ["src/**/*.js"]
	},

	shell: {
		// TODO - write external grunt tasks to do this git stuff
		release: {
			options: {
				stdout: true,
				failOnError: true
			},
			command: function(type) {
				var validTypes = ["patch", "minor", "major"];
				type = type || "patch";
				if (!~validTypes.indexOf(type)) {
					grunt.warn(
						"Release type must be one of "+validTypes.join(", "));
				}
				return [
					"git remote update",
					"git checkout develop",
					"git pull --ff-only",
					"git merge origin/master --ff-only",
					"npm version "+type+" -m 'Upgrading to %s'",
					"git checkout master",
					"git pull --ff-only",
					"git merge develop --ff-only",
					"git checkout develop"
				].join(" && ");
			}
		},
		publish: {
			options: {
				stdout: true,
				failOnError: true
			},
			command: [
				"git push origin develop:develop",
				"git push origin master:master",
				"git push --tags"
			].join(" && ")
		},
		loc: {
			options: {
				stdout: true,
				failOnError: true
			},
			command: ("cloc src itunes *.html *.json *.js *.md " +
					  "--by-file-by-lang --force-lang=HTML,mustache")
		}
	}
});

grunt.registerTask('generate-test-file', "Generates the big test.js file.", function () {
	var files = grunt.file.expandMapping(["src/**/test.js"], "../"),
		strFiles = JSON.stringify(files.map(function(f) { return f.dest; })),
		stealStatement = "steal(" + strFiles.substr(1,strFiles.length -2) + ");";
	grunt.file.write('test/test.js', stealStatement);
});

// Our own tasks
grunt.loadTasks("tasks");

// Default task(s).
grunt.registerTask('default', ['connect:server', 'test', 'build:app',
							   'copy', 'pages', "compress"]);
grunt.registerTask("release", "Make a release.", function(type) {
	grunt.task.run("default", "shell:release"+(type ?":"+type:""));
});
grunt.registerTask("publish", ["shell:publish"]);
grunt.registerTask("loc", ["shell:loc"]);
grunt.registerTask("server", ["connect:server:keepalive"]);
grunt.registerTask("serve", ["server"]);
grunt.registerTask("test", ["generate-test-file", "jshint", "testee:local"]);
};
