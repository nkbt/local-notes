"use strict";

define('app/user', ['dom', 'underscore', 'lib/app', 'lib/router', 'app/firebase/auth'], function ($, _, app, router, auth) {

	function init() {
		return auth(function (error, user) {
			return handleUser(user);
		});
	}


	function handleUser(user) {
//		console.log('user', user);
		var isGuest = _.isEmpty(user);
		app.$root.find('[data-app_user-guest]').toggle(isGuest);
		app.$root.find('[data-app_user-user]').toggle(!isGuest);
		if (isGuest) {
			return;
		}

		if (user.provider === "facebook") {
			user.avatar = ['/', 'graph.facebook.com', user.username, 'picture'].join('/');
		} else if (user.provider === "twitter") {
			user.avatar = user.profile_image_url;
		} else {
			var photo = user.photos && user.photos.shift();
			user.avatar = photo && photo.value || "";
		}
		console.log('user', user);
		app.fill(app.$root, 'data-app_user-user', user);
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