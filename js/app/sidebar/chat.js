"use strict";

define('app/sidebar/chat', ['dom', 'underscore', 'lib/app'], function ($, _, app) {


	var messages = [
		{user: 'user1', text: 'test1'},
		{user: 'user2', text: 'test2'},
		{user: 'user3', text: 'test3'},
		{user: 'user4', text: 'test4'},
		{user: 'user5', text: 'test5'}
	];
	
	function onChatReady(event) {
		console.log('onChatReady', onChatReady);
		var $element = $(event.target).closest('.app_sidebar_chat'),
			$container = $element.find('.app_sidebar_chat-container');
		
			$container.empty();
			return _.each(messages, function (message) {
				return app.template('sidebar/chat/item', function (template) {
					var $template = $(template);
					app.fill($template, 'data-app_sidebar_chat-item', message);
					return $template.appendTo($container);
				});
			});
	}

	app.$root
		.on('lib/layout:render:done', '.app_sidebar_chat', onChatReady);

});