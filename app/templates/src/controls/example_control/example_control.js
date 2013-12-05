steal("can", "./template.mustache", "./styles.less", function(can, template) {
	return can.Control.extend({
		defaults: {
			visible: can.compute(false),
			message: "Hello There!"
		}
	}, {
		init: function(el) {
			el.addClass("example-control");
			el.html(template(this.options));
		},
		click: function() {
			this.options.visible(!this.options.visible());
		}
    });
});
