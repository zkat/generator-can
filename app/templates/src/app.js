steal(
	"jquery",
	"can",
	"src/controls/example_control",
	"src/models/example_model",

	// Globally installed
	"src/components/example_component",
	"./app.less",
function($, can, ExampleControl, ExampleModel) {

	$("body").append(can.view("#body-template", {
		model: model
	}));

	var model = new ExampleModel();

	new ExampleControl($("#example-control"), {
		model: model
	});

});
