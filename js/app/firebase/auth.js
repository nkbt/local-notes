"use strict";

define('app/firebase/auth', ['app/firebase/host', 'Firebase', 'FirebaseSimpleLogin'], function (host, Firebase, FirebaseSimpleLogin) {
	
	return function (callback) {
		return new FirebaseSimpleLogin(new Firebase(host), callback || function() {});
	};
});