"use strict";

define(
	'app/controllers/note',
	[
		'dom', 'underscore', 'lib/app', 'lib/dom/form', 'lib/messenger',
		'lib/messenger'
	],
	function ($, _, app, form, messenger) {


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

		function onAddViewReady(event) {
			var $element = $(event.target).closest('.app_controllers_note-add');
			console.log('app/controllers/note', 'onAddReady', $element);
		}

		function onAddFormSubmit(event) {
			event.preventDefault();
			var $form = $(event.target).closest('.app_controllers_note-add-form');

			try {
			} catch (error) {
				return $form.trigger('lib/messenger:show', [messenger.TYPE_ERROR, error.message]);
			}

			if ($form.find(':invalid').length > 0) {
				return $form.trigger('lib/messenger:show', [messenger.TYPE_ERROR, 'Please, fill the form']);
			}

			form.disable($form);

			return setTimeout(function () {
				form.enable($form);
				return $form.trigger('lib/messenger:show', [messenger.TYPE_MESSAGE, 'OK']);
			}, 2000);
		}

		function onAddFormReset(event) {
			event.preventDefault();
			var $form = $(event.target).closest('.app_controllers_note-add-form');
			$form.trigger('app/map:markerReset');
		}

		function onMarkerMoved(event, lat, lng) {
			var $element = app.$root.find('.app_controllers_note-add');
			$element.find('.app_controllers_note-lat').val(lat);
			$element.find('.app_controllers_note-lng').val(lng);
		}

		app.$root
			.on('submit', '.app_controllers_note-add .app_controllers_note-add-form', onAddFormSubmit)
			.on('reset', '.app_controllers_note-add .app_controllers_note-add-form', onAddFormReset)
			.on('lib/layout:renderBlock:done', '.app_controllers_note-add', onAddViewReady)
			.on('app/map:markerMove:done', null, onMarkerMoved);


		return actions;


	}
);