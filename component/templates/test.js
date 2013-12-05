steal("jquery", "./test.mustache", "./<%= underscoredName %>.js", "funcunit", function($, template) {

	var container = $("<div>");
	module("components/<%= underscoredName %>", {
		setup: function() {
			container.html(template()).appendTo("#qunit-test-area");
		},
		teardown: function() {
			container.remove();
		}
	});

	test("Toggle behavior", function() {
		F("<%= dashedName %>").text("Click me", function() {
			ok(true, "Shows 'Click me' by default");
			F("<%= dashedName %>").click();
			F("<%= dashedName %>").text("Hello There!", function() {
				ok(true, "Switches to 'Hello There!' after a click");
				F("<%= dashedName %>").click();
				F("<%= dashedName %>").text("Click me", function() {
					ok(true, "Goes back to 'Click me' after another click");
				});
			});
		});
	});
});
