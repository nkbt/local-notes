"use strict";
/*global define: false, google: false */
/*jshint browser:true */
/*jslint browser:true */

define('app/map', ['dom', 'underscore', 'lib/app', 'lib/map'], function ($, _, app, map) {


	var markers = [],
		temporaryMarker = null;


	function markerAdd(googleMap, latLng, text) {
		var marker = new google.maps.Marker({map: googleMap, position: latLng, draggable: true});
		var infowindow = new google.maps.InfoWindow({content: text});
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.open(googleMap, marker);
		});
		return marker;
	}


	function temporaryMarkerAdd(googleMap, latLng) {
		if (temporaryMarker === null) {
			temporaryMarker = new google.maps.Marker({map: googleMap, position: latLng, draggable: true});
			google.maps.event.addListener(temporaryMarker, 'dragend', function (event) {
				var latLng = event.latLng;
				app.$root.trigger('app/map:markerMove:done', [latLng.lat(), latLng.lng()]);
			});
			app.$root.trigger('lib/dispatcher:dispatch', ['/note/add']);
		} else {
			temporaryMarker.setPosition(latLng);
			app.$root.trigger('app/map:markerMove:done', [latLng.lat(), latLng.lng()]);
		}
		return temporaryMarker;
	}


	function onMarkerAdd(event, lat, lng, text) {
		map(function (googleMap) {
			return markerAdd(googleMap, new google.maps.LatLng(lat, lng), text);
		})
	}


	function onMapClick(googleMap) {
		return _.debounce(function (event) {
			return temporaryMarkerAdd(googleMap, event.latLng);
		}, 300, true);
	}


	function onNoteAddReady(event) {
		if (!temporaryMarker) {
			return app.$root.trigger('lib/dispatcher:dispatch', ['/']);
		}
		var $element = $(event.target).closest('.app_controllers_note-add'),
			latLng = temporaryMarker.getPosition();
		$element.trigger('app/map:markerMove:done', [latLng.lat(), latLng.lng()]);
		return $element;
	}

	function onMarkerReset() {
		if (temporaryMarker) {
			google.maps.event.clearInstanceListeners(temporaryMarker);
			temporaryMarker.setMap(null);
			temporaryMarker = null;
		}

		return app.$root.trigger('lib/dispatcher:dispatch', ['/']);
	}

	app.$root
		.on('app/map:markerAdd', onMarkerAdd)
		.on('app/map:markerReset', onMarkerReset)
		.on('lib/layout:renderBlock:done', '.app_controllers_note-add', onNoteAddReady);


	/**
	 * @param {Map} googleMap
	 */
	function setup(googleMap) {
		google.maps.event.addListener(googleMap, 'click', onMapClick(googleMap));
	}


	function init() {
		app.$root.find('#googleMap').trigger('lib/map:init');
		map(setup);
	}


	$(init);


	return true;
});