"use strict";

define(
	'app/firebase/markers/auth',
	[
		'app/firebase/markers',
		'FirebaseSimpleLogin'
	],
	function (markers, FirebaseSimpleLogin) {

		return function (callback) {
			return new FirebaseSimpleLogin(markers, callback || function() {});
		};
	}
);