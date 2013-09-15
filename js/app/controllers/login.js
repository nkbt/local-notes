"use strict";

define(
	'app/controllers/login',
	[
		'lib/app',
		'lib/messenger',
		'app/firebase/markers/auth'
	],
	function (app, messenger, auth) {

		var authObject = auth(function (error, user) {
			if (error) {
				app.$root.trigger('lib/messenger:show', [messenger.TYPE_ERROR, error.message]);
			} else if (user) {
				app.$root.trigger('lib/messenger:show', [messenger.TYPE_MESSAGE, ["Logged in as '", user.displayName, "'"].join('')]);

			}
		});
		console.log('authObject', authObject);

		function loginWith(provider) {
			authObject.login(provider)
		}

		var actions = {};

		actions.twitter = function () {
			return loginWith('twitter');
		};

		actions.facebook = function () {
			return loginWith('facebook');
		};

		app.$root.on('lib/dispatcher:run', null, function (event, controller, action) {
			if (controller === 'login') {
				actions[action] && actions[action].call();
			}
		});


		return actions;

	}
);