steal("jquery", "./test.mustache", "./example_control.js", "funcunit", function($, template, ExampleControl) {

	var container = $("<div>");
	module("controls/example_control", {
		setup: function() {
			container.html(template()).appendTo("#qunit-test-area");
			new ExampleControl($("#example-control"));
		},
		teardown: function() {
			container.remove();
		}
	});

	test("Toggle behavior", function() {
		F("#example-control").text("Click me", function() {
			ok(true, "Shows 'Click me' by default");
			F("#example-control").click();
			F("#example-control").text("Hello There!", function() {
				ok(true, "Switches to 'Hello There!' after a click");
				F("#example-control").click();
				F("#example-control").text("Click me", function() {
					ok(true, "Goes back to 'Click me' after another click");
				});
			});
		});
	});
});
