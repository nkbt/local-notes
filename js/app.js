'use strict';

require.config({
	urlArgs: window.noCacheSuffix,
	baseUrl: 'js',
	paths: {
		underscore: 'vendor/underscore',
		dom: 'vendor/jquery',
		string: 'vendor/string',
		bootstrap: ['vendor/bootstrap', '//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js'],
		history: 'vendor/history/html4',
		geo: 'vendor/geo',
		firebase: '//cdn.firebase.com/v0/firebase'
	},
	shim: {
		async: {
			exports: 'async'
		},
		underscore: {
			exports: '_'
		},
		string: {
			exports: 'S'
		},
		dom: {
			exports: 'jQuery'
		},
		geo: {
			exports: 'geo_position_js'
		},
		firebase: {
			exports: 'Firebase'
		},
		history: {
			init: function () {
				History.options.html4Mode = true;
				History.options.debug = true;
				return History;
			}
		},
		bootstrap: ['dom']
	},
	config: {
		'lib/app': {
			baseUrl: '../'
		},
		'lib/map': {
			lat: 151.2151336669922,
			lng: -33.85673152928874,
			zoom: 10
		}
	},
	deps: [
	]
});

// Load CSS
require([
	'vendor/require/css!../css/bootstrap.css',
	'vendor/require/css!../css/bootstrap-theme.css',
	'vendor/require/css!../css/font-awesome.css',
	'vendor/require/css!../css/style.css'
], function () {
	console.log('CSS loaded');
});

// Start the main app logic.
require([
	'dom',
	'lib/app',
	'bootstrap',
	'lib/layout',
	'lib/dispatcher',
	'lib/sidebar',
	'app/map'
], function ($, app) {
	console.log('App loaded');

	$(function () {
		app.$root.trigger('lib/layout:render');
		app.$root.trigger('lib/dispatcher:dispatch', ['/']); // Always start from home
	});
});