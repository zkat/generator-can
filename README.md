# generator-can [![Build Status](https://secure.travis-ci.org/zkat/generator-can.png?branch=master)](https://travis-ci.org/zkat/generator-can)

A [CanJS](http://canjs.com) application generator for
[Yeoman](http://yeoman.io).

## Getting Started

Make sure `yo` is installed.

```
$ sudo npm install -g yo
```

Install the CanJS `yo` generator.

```
$ sudo npm install -g generator-can
```

Make a directory for your project and `cd` into it.

```
$ mkdir my-new-project && cd $_
```

Finally, initiate the generator:

```
$ yo can
```

To make the most of your scaffold, you'll want [Grunt](http://gruntjs.com) and
[Bower](http://bower.io) installed, as well:

```
$ sudo npm install -g grunt-cli bower
```

## Developing an application

The scaffold builds out everything you need to have a buildable, deployable
CanJS application -- this includes an initial source file structure, some
placeholder files, some default dependencies, and even a few `git` utilities.

### Running the static proxy

`$ grunt serve`

And then just navigate to http://localhost:8125/src/app.html

### Building the application

`$ grunt build`

This command will run `jshint` and the test suite (using
[testee](http://github.com/bitovi/testee.js)), and will output a tarball called
`app.tgz` in the root of your project.

You can also access the built version of the application through the static
proxy by visiting http://localhost:8125/build/index.html

### Writing a new can.Component

`$ yo can:component <name>`

This will generate a new templated component under `src/components/<underscored
name>`. The new component includes a base file, as well as placeholder
`styles.less` and `template.mustache` files. The component also has a `test.js`
file and a corresponding `test.mustache` you can use. It is automatically
integrated into `grunt test`, and you can immediately run `grunt
generate-test-file` and visit
http://localhost:8125/test/test.html?module=components%2component_name to see
the results of running its test suite.

You can provide `<name>` as either `name-with-dashes` or
`name_with_underscores`. You *must* provide the name in one of these two
formats, and the name *must* be multiple words for the time being. The
underscored version of the name (generated by the scaffold based on input) will
be used as the directory and filename for the component files. The dashed
version will be used as the tag name.

### Writing a new can.Control

`$ yo can:control <name>`

For new CanJS application development, `can.Component` is preferred, though
`can.Control` is still fully supported.

This will generate a new templated control under `src/components/<underscored
name>`. The new control includes a base file, as well as placeholder
`styles.less` and `template.mustache` files. The control also has a `test.js`
file and a corresponding `test.mustache` you can use. It is automatically
integrated into `grunt test`, and you can immediately run `grunt
generate-test-file` and visit
http://localhost:8125/test/test.html?module=controls%2control_name to see the
results of running its test suite.

### Writing a new can.Model

`$ yo can:model <model_name>`

This will generate a new templated model under `src/models/<model_name>`. The
new model includes a base file as well as a `test.js` file that is automatically
integrated into `grunt test`. You can immediately run `grunt generate-test-file`
and visit http://localhost:8125/test/test.html?module=models%2model_name to see
the results of running its test suite.
