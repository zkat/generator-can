steal("can", "./template.mustache", "./styles.less", function(can, template) {
	return can.Component.extend({
		tag: "<%= dashedName %>",
		template: template,
		scope: {
			visible: false,
			message: "Hello There!"
		},
		events: {
			click: function() {
				this.scope.attr("visible", !this.scope.attr("visible") );
			}
		}
    });
});
