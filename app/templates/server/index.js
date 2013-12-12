var path = require("path"),
	_ = require("lodash");
module.exports = function(connect, options) {
	var middlewares = [],
		directory = options.directory || options.base[options.base.length -1];

	middlewares.push(connect.favicon());
	middlewares.push(connect.logger("dev"));

	_.forEach((options.services || []), function(handler, route) {
		if (typeof handler === "string") {
			handler = require("./proxy")(handler);
		}
		function mw(request, response, next) {
			if (!request.url.indexOf(route)) {
				request.originalUrl = request.url;
				request.url = request.url.substr(route.length);
				handler.apply(this, arguments);
			} else {
				next();
			}
		}
		mw.route = route;
		middlewares.push(mw);
	});


	if (!Array.isArray(options.base)) {
		options.base = [options.base];
	}
	options.base.forEach(function(base) {
		middlewares.push(connect.static(base));
		middlewares.push(
			connect.directory(path.join(base, directory), {icons: true}));
	});

	return middlewares;
};
