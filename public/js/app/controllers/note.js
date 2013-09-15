"use strict";

define(
	'app/controllers/note',
	[
		'dom', 'underscore', 'lib/app',
		'lib/messenger'
	],
	function ($, _, app) {


		var actions = {};

		actions.add = function (template) {
			app.$root.trigger('lib/layout:renderBlock', ['content', template]);
		};

		function destroy() {

		}


		app.$root.on('lib/dispatcher:run', null, function (event, controller, action) {
			if (controller === 'note') {
				app.view(controller, action, actions[action]);
			} else {
				destroy();
			}
		});

		function onAddReady(event) {
			var $element = $(event.target).closest('.app_controllers_note-add');
			console.log('app/controllers/note', 'onAddReady', $element);


		}

		app.$root
			.on('lib/layout:renderBlock:done', '.app_controllers_note-add', onAddReady);


		return actions;


	}
);