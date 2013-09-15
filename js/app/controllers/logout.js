"use strict";

define(
	'app/controllers/logout',
	[
		'lib/app',
		'lib/messenger',
		'app/firebase/markers/auth'
	],
	function (app, messenger, auth) {


		var actions = {};


		actions.logout = function () {
			var authObject = auth(function (error, user) {
				if (user) {
					authObject.logout();
				}
				if (!user) {
					app.$root.trigger('lib/messenger:show', [messenger.TYPE_MESSAGE, "Successfully logged out"]);
				}
			});
		};


		app.$root.on('lib/dispatcher:run', null, function (event, controller, action) {
			if (controller === 'logout') {
				actions[action] && actions[action].call();
			}
		});


		return actions;


	}
);