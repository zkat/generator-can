'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var ControlGenerator = module.exports = function ControlGenerator(args, options, config) {
	// By calling `NamedBase` here, we get the argument to the subgenerator call
	// as `this.name`.
	yeoman.generators.NamedBase.apply(this, arguments);
	this.dashedName = this.name.replace("_", "-");
	this.underscoredName = this.name.replace("-", "_");
	this.destinationRoot("src/controls/"+this.underscoredName);
	this.mkdir(this.destinationRoot());
};

util.inherits(ControlGenerator, yeoman.generators.NamedBase);

ControlGenerator.prototype.files = function files() {
	this.template("_control.js", this.name+".js");
	this.template("test.js", "test.js");
	this.template("test.mustache", "test.mustache");
	this.template("styles.less", "styles.less");
	this.template("template.mustache", "template.mustache");
};
