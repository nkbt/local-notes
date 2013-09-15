"use strict";

define(
	'app/controllers/index',
	[
		'dom', 'underscore', 'lib/app',
		'lib/messenger'
	],
	function ($, _, app) {


		var actions = {};

		actions.index = function (template) {
			app.$root.trigger('lib/layout:renderBlock', ['content', template]);
		};

		function destroy() {

		}


		app.$root.on('lib/dispatcher:run', null, function (event, controller, action) {
			if (controller === 'index') {
				app.view(controller, action, actions[action]);
			} else {
				destroy();
			}
		});

		function onIndexReady(event) {
			var $element = $(event.target).closest('.app_controllers_index-index');
			console.log('app/controllers/index', 'onIndexReady', $element);


		}

		app.$root
			.on('lib/layout:renderBlock:done', '.app_controllers_index-index', onIndexReady);


		return actions;


	}
);