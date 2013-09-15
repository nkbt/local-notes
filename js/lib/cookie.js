"use strict";

define('lib/cookie', ['lib/app'], function (app) {
	console.log('util/cookie loaded');

	var cookieSet = function (name, value, days, domain, path) {

		var cookieData = [
			[name, value].join('=')
		];

		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 86400000)); // 24 * 60 * 60 * 1000
			cookieData.push(["expires", date.toGMTString()].join('='));
		}
		if (domain) {
			cookieData.push(["domain", domain].join('='));
		}
		if (!path) {
			path = '/';
		}
		cookieData.push(["path", path].join('='));
		document.cookie = cookieData.join(';');
	};

	var cookieGet = function (name) {

		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) == 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}
		return null;
	};

	var cookieDelete = function (name, domain, path) {

		cookieSet(name, "", -1, domain, path);
	};

	app.$root
		.on('util/cookie:set', function (event, name, value, days, domain, path) {
			cookieSet(name, value, days, domain, path);
		})
		.on('util/cookie:get', function (event, name, callback) {
			callback(cookieGet(name));
		})
		.on('util/cookie:delete', function (event, name) {
			cookieDelete(name);
		});

	return {
		set: cookieSet,
		get: cookieGet,
		delete: cookieDelete
	}
});