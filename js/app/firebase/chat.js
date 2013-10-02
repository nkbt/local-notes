"use strict";

define('app/firebase/chat', ['app/firebase/host', 'Firebase'], function (host, Firebase) {
	return new Firebase([host, 'chats'].join('/'));
});