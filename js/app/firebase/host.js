"use strict";

define('app/firebase/host', [], function () {

	var namespace = document.location.host.toLowerCase().replace(/[^a-z]+/g, '-');
	return ['//', namespace, '.firebaseio.com'].join('');
});