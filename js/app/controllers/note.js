"use strict";

define(
	'app/controllers/note',
	[
		'dom', 'underscore', 'lib/app', 'lib/dom/form', 'lib/messenger', 'app/firebase/markers',
		'lib/messenger'
	],
	function ($, _, app, form, messenger, markers) {


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

		function onAddFormSubmit(event) {
			event.preventDefault();
			var $form = $(event.target).closest('.app_controllers_note-add-form'),
				values = form.values($form);

			if ($form.find(':invalid').length > 0) {
				return $form.trigger('lib/messenger:show', [messenger.TYPE_ERROR, 'Please, fill the form']);
			}

			form.disable($form);
			return markers.push(values, function (error) {
				form.enable($form);
				if (error) {
					var errorMessage = error.code === 'PERMISSION_DENIED' && 'Login, please' || error.message;
					return $form.trigger('lib/messenger:show', [messenger.TYPE_ERROR, ['Cannot save. ', errorMessage].join('')]);
				}
				$form.trigger('app/map:markerReset');
				return $form.trigger('lib/messenger:show', [messenger.TYPE_MESSAGE, 'Saved.']);
			});
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
			.on('app/map:markerMove:done', null, onMarkerMoved);


		return actions;


	}
);