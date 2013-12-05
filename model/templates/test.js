steal("./<%= name %>", "funcunit", function(Model) {

	module("models/<%= name %>");

	test("Can be instantiated", function() {
		ok(new Model());
	});
});
