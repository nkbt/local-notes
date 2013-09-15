"use strict";

define(
	'app/firebase/markers',
	[
		'Firebase'
	],
	function (Firebase) {

		var namespace = document.location.host.toLowerCase().replace(/[^a-z]+/g, '-');
		return new Firebase(['//', namespace, '.firebaseio.com/markers'].join(''));
	}
);