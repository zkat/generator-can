var path = require("path"),
	_ = require("lodash"),
	bytes = require("bytes");

module.exports = function(connect, options) {
	var middlewares = [],
		directory = options.directory || options.base[options.base.length -1];

	middlewares.push(connect.favicon());
	middlewares.push(connect.logger(loggerFormat));

	_.forEach((options.services || []), function(handlerInfo, route) {
		var handler;
		route = handlerInfo.target || route;
		console.log("Installing proxy handler for "+route);
		if (typeof handlerInfo === "string") {
			handler = require("./proxy")(handlerInfo);
		} else {
			handler = handlerInfo.handler(handlerInfo.options);
		}
		function mw(request, response, next) {
			if (!request.url.toLowerCase().indexOf(route.toLowerCase())) {
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

function loggerFormat(tokens, req, res){
	var status = res.statusCode,
		len = parseInt(res.getHeader('Content-Length'), 10),
		color = 32;

	if (status >= 500) color = 31
	else if (status >= 400) color = 33
	else if (status >= 300) color = 36;

	len = isNaN(len)
		? ''
		: len = ' - ' + bytes(len);

	return '\x1b[90m' + req.method + ' '
		+ req.originalUrl + ' '
		+ (req.proxyUrl ? "\x1b["+35+"m->\x1b[90m " + req.proxyUrl + " ": "")
		+ '\x1b[' + color + 'm' + res.statusCode
		+ ' \x1b[90m'
		+ (new Date - req._startTime)
		+ 'ms' + len
		+ '\x1b[0m';
}
