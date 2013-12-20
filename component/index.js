'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var ComponentGenerator = module.exports = function ComponentGenerator(args, options, config) {
	// By calling `NamedBase` here, we get the argument to the subgenerator call
	// as `this.name`.
	yeoman.generators.NamedBase.apply(this, arguments);
	this.dashedName = this.name.replace("_", "-");
	this.underscoredName = this.name.replace("-", "_");
	if (!~this.dashedName.indexOf("-")) {
		throw new Error("Component name must include at least one dash or underscore.");
	}
	this.destinationRoot("src/components/"+this.underscoredName);
	this.mkdir(this.destinationRoot());
};

util.inherits(ComponentGenerator, yeoman.generators.NamedBase);

ComponentGenerator.prototype.files = function files() {
	this.template("_component.js", this.underscoredName+".js");
	this.template("test.js", "test.js");
	this.template("test.mustache", "test.mustache");
	this.template("styles.less", "styles.less");
	this.template("template.mustache", "template.mustache");
	this.template("sandbox.html", "sandbox.html");
};
