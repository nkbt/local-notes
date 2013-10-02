"use strict";

define(
	'app/controllers/logout',
	[
		'lib/app',
		'lib/messenger',
		'app/firebase/auth'
	],
	function (app, messenger, auth) {

		var authObject = auth(function (error, user) {
			if (error) {
				app.$root.trigger('app/controllers/logout:fail', error);
			} else if (!user) {
				app.$root.trigger('app/controllers/logout:success');
			}
		});

		var actions = {};


		actions.index = function () {
			return authObject.logout();
		};


		app.$root.on('lib/dispatcher:run', null, function (event, controller, action) {
			if (controller === 'logout') {
				actions[action] && actions[action].call();
			}
		});

		app.$root
			.on('app/controllers/logout:fail', function (event, error) {
				app.$root.trigger('lib/messenger:show', [messenger.TYPE_ERROR, error.message]);
			})
			.on('app/controllers/logout:success', function () {
				console.log('app/controllers/logout', 'app/controllers/logout:success');
				app.$root.trigger('lib/messenger:show', [messenger.TYPE_MESSAGE, "Successfully logged out"]);
			});

		return actions;


	}
);