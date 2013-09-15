"use strict";
/*global define: false, google: false */
/*jshint browser:true */
/*jslint browser:true */

define('app/map', ['dom', 'underscore', 'lib/app', 'lib/map'], function ($, _, app, map) {


	function markerAdd(googleMap, latLng, text) {
		var marker = new google.maps.Marker({map: googleMap, position: latLng, draggable: true});
		var infowindow = new google.maps.InfoWindow({content: text});
		google.maps.event.addListener(marker, 'click', function () {
			infowindow.open(googleMap, marker);
		});
		return marker;
	}

	function onMarkerAdd(event, lat, lng, text) {

		map(function (googleMap) {
			return markerAdd(googleMap, new google.maps.LatLng(lat, lng), text);
		})

	}

	
	
	
	
	
	

	function onMapClick(googleMap) {
		return function (event) {
			var latLng = event.latLng;
			
			app.$root.trigger('lib/dispatcher:dispatch', ['/note/add']);
			
			markerAdd(googleMap, latLng, 'test');
		}
	}


	function setup(googleMap) {

		google.maps.event.addListener(googleMap, 'click', onMapClick(googleMap));

//		app.$root.trigger('lib/map:marker-add', [-33.8389324 , 151.2155156 , 'hello']);
//		google.maps.event.addListener(googleMarker, 'dragend', function () {
//			var position = googleMarker.getPosition();
//			$element.trigger('googleMap:markerMoved', [position.lat(), position.lng()]);
//		});
//
//		googleMap.panTo(googleMarker.getPosition());

	}

	function init() {
		app.$root.find('#googleMap').trigger('lib/map:init');
		map(setup);
	}

	$(init);


	app.$root.on('app/map:markerAdd', onMarkerAdd);

	return true;
});