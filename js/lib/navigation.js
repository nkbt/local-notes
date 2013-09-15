"use strict";

define('lib/navigation', ['module', 'dom', 'underscore', 'lib/app', 'app/firebase/markers/auth'], function (module, $, _, app, auth) {

	var config = _.defaults(module.config(), {
		active: 'active'
	});


	var templateLoaded = false, delegates = [];


	function checkUser($element) {
		auth(function(error, user) {
			$element.find('[data-lib_navigation-guest]').toggle(!user);
			$element.find('[data-lib_navigation-user]').toggle(!!user);
			return user && user.displayName && $element.find('[data-lib_navigation-user-name]').html(user.displayName);
		});
	}
	
	function changeUrl(path) {
		return function () {
			app.$root.find(['.lib_navigation-item', config.active].join('.')).removeClass(config.active);
			return app.$root.find('.lib_navigation-item[data-lib_navigation-match="' + path + '"]').addClass(config.active);
		};
	}

	function onUrlChanged(event, path) {
		return templateLoaded && changeUrl(path)() || delegates.push(changeUrl(path));
	}

	function init(event) {
		var $element = $(event.target).closest('.lib_navigation');
		templateLoaded = true;
		_.each(delegates, function (delegate) {
			return delegate.call();
		});
		delegates = [];
		
		return checkUser($element);
	}

	app.$root.on('lib/dispatcher:urlChanged', null, onUrlChanged);
	app.$root.one('lib/layout:render:done', '.lib_navigation', init);


	return {
	};

});