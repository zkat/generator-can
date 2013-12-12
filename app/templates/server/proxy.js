var http = require("http"),
	https = require("https"),
    url = require('url'),
	_ = require("lodash");

function proxyRequest(target, request, response) {
	var proxyurl = target + request.url,
		parsed = url.parse(proxyurl, true);

	var preq = (parsed.protocol === "https:"?https:http).request({
		hostname: parsed.hostname,
		port: parsed.port,
		path: parsed.path,
		method: request.method,
		headers: _.extend({}, request.headers, {host: parsed.hostname})
	}).on("response", function(pres) {
		response.writeHead(pres.statusCode, pres.headers);
		pres.on("data", function(data) {
			response.write(data, "binary");
		}).on("end", function() {
			response.end();
		});
	}).on("error", function(e) {
		response.writeHead(500, {"content-type": "text/html"});
		response.end(e, "utf-8");
	});
	request.on("data", function(data) {
		preq.write(data, "binary");
	}).on("end", function() {
		preq.end();
	});
}

module.exports = function(target) {
	return _.partial(proxyRequest, target);
};
