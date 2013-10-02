"use strict";

define('app/user', ['dom', 'underscore', 'lib/app', 'lib/router', 'app/firebase/markers/auth'], function ($, _, app, router, auth) {

	function init() {
		return auth(function (error, user) {
			return handleUser(user);
		});
	}


	function handleUser(user) {

		var isGuest = _.isEmpty(user);
		app.$root.find('[data-app_user-guest]').toggle(isGuest);
		app.$root.find('[data-app_user-user]').toggle(!isGuest);
		if (!isGuest) {
			app.fill(app.$root, 'data-app_user-user', user);
		}
	}

	function onLogin(event, user) {
		return handleUser(user);
	}


	function onLogout() {
		return handleUser();
	}

	app.$root
		.on('app/controllers/login:success', onLogin)
		.on('app/controllers/logout:success', onLogout)
		.one('lib/layout:render:done', '.app_user', init);
	

	return {
	};
});