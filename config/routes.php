<?php

// [0] = method
// [1] = url
// [2] = controller action
// \Pux\Mux->[0]([1], '\\Reader\\Controller\\[2]');

return [
	['post', '/api/authentication/login', 'Authentication:login'],
	['post', '/api/authentication/logout', 'Authentication:logout'],
	['get', '/api/category', 'Category:main'],
	['get', '/api/category/:categoryId', 'Category:get'],
	['get', '/api/category/:categoryId/feed', 'Category:listFeed'],
	['get', '/api/category/:categoryId/entry', 'Category:listEntry'],
	['get', '/api/category/:categoryId/entry/random', 'Category:listEntryRandom'],
	['get', '/api/feed/:feedId/entry', 'Entry:listFeed'],
	['get', '/api/feed/:feedId', 'Feed:get'],
	['get', '/api/entry/:entryId', 'Entry:get'],
	['post', '/api/entry/:entryId/read', 'Entry:setRead'],
	['post', '/api/entry/:entryId/marked', 'Entry:setMarked'],
];
