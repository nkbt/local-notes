"use strict";
/*global define: false, google: false */
/*jshint browser:true */
/*jslint browser:true */

define('app/map', ['dom', 'underscore', 'lib/app', 'lib/map', 'app/firebase/markers'], function ($, _, app, map, markers) {


	var temporaryMarker = null,
		googleMarkers = {};


	function markerAdd(googleMap, id, latLng, text) {
		googleMarkers[id] = {
			marker: new google.maps.Marker({map: googleMap, position: latLng, draggable: false}),
			info: new google.maps.InfoWindow({content: text})
		};
		google.maps.event.addListener(googleMarkers[id].marker, 'click', function () {
			googleMarkers[id].info.open(googleMap, googleMarkers[id].marker);
		});
		return googleMarkers[id];
	}


	function markerUpdate(googleMap, id, latLng, text) {
		if (!googleMarkers[id]) {
			return markerAdd(googleMap, id, latLng, text);
		}
		googleMarkers[id].marker.setPosition(latLng);
		googleMarkers[id].info.setContent(text);
		return googleMarkers[id];
	}


	function markerRemove(id) {
		if (googleMarkers[id]) {
			google.maps.event.clearInstanceListeners(googleMarkers[id].marker);
			google.maps.event.clearInstanceListeners(googleMarkers[id].info);
			googleMarkers[id].marker.setMap(null);
			googleMarkers[id].info.setMap(null);
			googleMarkers[id] = null;
			delete googleMarkers[id];
		}
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


	function onMarkerAdd(event, id, lat, lng, text) {
		map(function (googleMap) {
			return markerAdd(googleMap, id, new google.maps.LatLng(lat, lng), text);
		})
	}

	function onMarkerUpdate(event, id, lat, lng, text) {
		map(function (googleMap) {
			return markerUpdate(googleMap, id, new google.maps.LatLng(lat, lng), text);
		})
	}


	function onMarkerRemove(event, id) {
		return markerRemove(id);
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
		.on('app/map:markerUpdate', onMarkerUpdate)
		.on('app/map:markerRemove', onMarkerRemove)
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


	markers.on('child_added', function (snapshot) {
		var marker = snapshot.val();
		app.$root.trigger('app/map:markerAdd', [snapshot.name(), marker.lat, marker.lng, marker.note]);
	});
	markers.on('child_changed', function (snapshot) {
		var marker = snapshot.val();
		app.$root.trigger('app/map:markerUpdate', [snapshot.name(), marker.lat, marker.lng, marker.note]);
	});
	markers.on('child_removed', function (snapshot) {
		app.$root.trigger('app/map:markerRemove', [snapshot.name()]);
	});


	return true;
});