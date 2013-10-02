"use strict";

define(
	'app/controllers/login',
	[
		'lib/app',
		'lib/messenger',
		'app/firebase/auth'
	],
	function (app, messenger, auth) {

		var authObject = auth(function (error, user) {
			if (error) {
				app.$root.trigger('app/controllers/login:fail', error);
			} else if (user) {
				app.$root.trigger('app/controllers/login:success', user);
			}
		});


		function loginWith(provider, options) {
			authObject.login(provider, options)
		}


		var actions = {};

		actions.twitter = function () {
			return loginWith('twitter', {
				rememberMe: true
			});
		};

		actions.facebook = function () {
			return loginWith('facebook', {
				rememberMe: true
			});
		};

		app.$root.on('lib/dispatcher:run', null, function (event, controller, action) {
			if (controller === 'login') {
				actions[action] && actions[action].call();
			}
		});


		app.$root
			.on('app/controllers/login:fail', function (event, error) {
				app.$root.trigger('lib/messenger:show', [messenger.TYPE_ERROR, error.message]);
			})
			.on('app/controllers/login:success', function (event, user) {
				app.$root.trigger('lib/messenger:show', [messenger.TYPE_MESSAGE, ["Logged in as '", user.displayName, "'"].join('')]);
			});


		return actions;

	}
);