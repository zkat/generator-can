steal("./example_model", "funcunit", function(ExampleModel) {

	module("models/example_model");

	test("Can be instantiated", function() {
		ok(new ExampleModel());
	});
});
