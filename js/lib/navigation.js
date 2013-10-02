"use strict";

define('lib/navigation', ['module', 'dom', 'underscore', 'lib/app', 'lib/router'], function (module, $, _, app, router) {

	var config = _.defaults(module.config(), {
			active: 'active'
		}),
		templateLoaded = false,
		delegates = [];

	function changeUrl(path) {
		var route = router.parse(router.route(path)),
			match = router.clean([route.controller, route.action].join('/'));
		return function () {
			app.$root.find(['.lib_navigation-item', config.active].join('.')).removeClass(config.active);
			return app.$root.find('.lib_navigation-item[data-lib_navigation-route="' + match + '"]').addClass(config.active);
		};
	}

	function onUrlChanged(event, path) {
		return templateLoaded && changeUrl(path)() || delegates.push(changeUrl(path));
	}

	function init(event) {
		templateLoaded = true;
		_.each(delegates, function (delegate) {
			return delegate.call();
		});
		delegates = [];
	}

	app.$root
		.on('lib/dispatcher:urlChanged', onUrlChanged)
		.one('lib/layout:render:done', '.lib_navigation', init);


	return {
	};

});