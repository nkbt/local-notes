"use strict";

define(
	'app/controllers/user',
	[
		'dom', 'underscore', 'lib/app',
		'lib/messenger',
		'app/firebase/markers/auth'
	],
	function ($, _, app, messenger, auth) {


		var actions = {};

		actions.login = function (template) {
			app.$root.trigger('lib/layout:renderBlock', ['content', template]);
		};

		actions.logout = function (template) {
			var authObject = auth(function(error, user) {
				if (user) {
					authObject.logout();
				}
				if (!user) {
					app.$root.trigger('lib/messenger:show', [messenger.TYPE_MESSAGE, "Successfully logged out"]);
				}
			});
		};

		function destroy() {

		}


		app.$root.on('lib/dispatcher:run', null, function (event, controller, action) {
			if (controller === 'user') {
				app.view(controller, action, actions[action]);
			} else {
				destroy();
			}
		});

		function onIndexReady(event) {
			var $element = $(event.target).closest('.app_controllers_user-login');
			console.log('app/controllers/user', 'onIndexReady', $element);


		}

		function onClickLogin(event) {
			var $button = $(event.target).closest('.app_controllers_user-login-button'),
				provider = $button.data('app_controllers_user-provider');

			auth(function(error, user) {
				if (error) {
					return $button.trigger('lib/messenger:show', [messenger.TYPE_ERROR, error.message]);
				}

				if (user) {
					console.log('user', user);
					return $button.trigger('lib/messenger:show', [messenger.TYPE_MESSAGE, ["Logged in as '", user.displayName, "'"].join('')]);
				}

				return auth.login('twitter');
			});
		}


		app.$root
			.on('lib/layout:renderBlock:done', '.app_controllers_user-login', onIndexReady)
			.on('click', '.app_controllers_user-login .app_controllers_user-login-button', onClickLogin);


		return actions;


	}
);