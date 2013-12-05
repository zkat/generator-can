steal("jquery", "./test.mustache", "./<%= name %>.js", "funcunit", function($, template, Control) {

	var container = $("<div>");
	module("controls/<%= name %>", {
		setup: function() {
			container.html(template()).appendTo("#qunit-test-area");
			new Control($("#<%= name %>"));
		},
		teardown: function() {
			container.remove();
		}
	});

	test("Toggle behavior", function() {
		F("#<%= name %>").text("Click me", function() {
			ok(true, "Shows 'Click me' by default");
			F("#<%= name %>").click();
			F("#<%= name %>").text("Hello There!", function() {
				ok(true, "Switches to 'Hello There!' after a click");
				F("#<%= name %>").click();
				F("#<%= name %>").text("Click me", function() {
					ok(true, "Goes back to 'Click me' after another click");
				});
			});
		});
	});
});
