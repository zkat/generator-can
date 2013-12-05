steal("jquery", "./test.mustache", "./example_component.js", "funcunit", function($, template) {

	var container = $("<div>");
	module("components/example_component", {
		setup: function() {
			container.html(template()).appendTo("#qunit-test-area");
		},
		teardown: function() {
			container.remove();
		}
	});

	test("Toggle behavior", function() {
		F("example-component").text("Click me", function() {
			ok(true, "Shows 'Click me' by default");
			F("example-component").click();
			F("example-component").text("Hello There!", function() {
				ok(true, "Switches to 'Hello There!' after a click");
				F("example-component").click();
				F("example-component").text("Click me", function() {
					ok(true, "Goes back to 'Click me' after another click");
				});
			});
		});
	});
});
