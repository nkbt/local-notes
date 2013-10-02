"use strict";

define('app/firebase/markers', ['app/firebase/host', 'Firebase'], function (host, Firebase) {
	return new Firebase([host, 'markers'].join('/'));
});