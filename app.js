'use strict';
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var port = process.env.PORT || 3000;
var root = path.join(__dirname, process.env.DOCUMENT_ROOT || 'public');
http
	.createServer(function (req, res) {
		var filename = url.parse(req.url).pathname,
			filePath;

		if (filename === '/') {
			filename = '/index.html';
		}
		filePath = path.join(root, filename);

		console.log('filename', filename);
		var stream = fs.createReadStream(filePath, {
			flags: 'r',
			encoding: 'utf-8',
			fd: null,
			autoClose: true
		});
		stream.on('error', function () {
			res.writeHead(404);
			res.end('');
		});

		return stream.pipe(res);
	})
	.listen(port, function () {
		console.log(['Server running on port: ', port].join(''));

	});
