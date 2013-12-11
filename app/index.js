'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require("fs");

var CanGenerator = module.exports = function CanGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CanGenerator, yeoman.generators.Base);

CanGenerator.prototype.getAppName = function getAppName() {
	var cb = this.async();

	this.prompt([{
		name: "appName",
		type: "input",
		message: "What should the app be called?",
		filter: function(x) { return x.trim(); },
		validate: function(x) { return /[a-z]+/i.test(x); }
	}], function(props) {
		this.opts = props;
		cb();
	}.bind(this));
};

CanGenerator.prototype.basicFiles = function basicFiles() {
	this.copy("gitignore", ".gitignore");
	this.copy("editorconfig", ".editorconfig");
	this.copy("jshintrc", ".jshintrc");
};

CanGenerator.prototype.depsFiles = function depsFiles() {
	this.template('_package.json', 'package.json');
	this.template('_bower.json', 'bower.json');
};

CanGenerator.prototype.gruntFiles = function gruntFiles() {
	this.template("Gruntfile.js", "Gruntfile.js", {
		mainPage: "<%= mainPage %>",
		buildDir: "<%= buildDir %>",
		version: "<%= version %>"
	});
	this.directory("tasks");
};

CanGenerator.prototype.docFiles = function docFiles() {
	this.template("README.md", "README.md");
	this.directory("doc", "doc");
};

CanGenerator.prototype.stealFiles = function stealFiles() {
	this.template("stealconfig.js", "stealconfig.js");
	fs.symlinkSync(this.destinationRoot()+"/bower_components/steal",
                   this.destinationRoot()+"/steal");
};

CanGenerator.prototype.testFiles = function testFiles() {
	this.directory("test", "test");
};

CanGenerator.prototype.srcDir = function srcDir() {
	this.directory("src", "src");
};
