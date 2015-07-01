/* global APPLICATION_ENV */

(function (angular) {
	'use strict';

	angular.module('Reader', [
		'Reader.Login',
		'Reader.CategoryList',
		'Reader.FeedList',
		'Reader.EntryList',
		'Reader.EntryView',
		'Reader.ImageScrollerView',
		'ngRoute',
		'cfp.hotkeys'
	]);

	angular.module('Reader')
		.run(function($location, $resource, hotkeys, config) {
			hotkeys.add({
				combo: 'l',
				description: 'Logout',
				callback: function() {
					$resource(config.apiUrl + '/authentication/logout').save();
					delete sessionStorage.authToken;
					$location.url('/login');
				}
			});
		})
		.constant('env', APPLICATION_ENV)
		.constant('config', (function() {
			switch (APPLICATION_ENV) {
				case 'prod':
					return {
						apiUrl: 'http://reader.zimzat.com/api'
					};
				case 'dev':
				default:
					return {
						apiUrl: 'http://reader.dev/api'
					};
			}
		})())
		.config(function ($routeProvider, $locationProvider, $httpProvider, hotkeysProvider) {
			$routeProvider
				.when('/login', {
					templateUrl: 'app/Login/Login.html',
					controller: 'Reader.Login.Controller'
				})
				.when('/', {
					templateUrl: 'app/CategoryList/CategoryList.html',
					controller: 'Reader.CategoryList.Controller'
				})
				.when('/category/:categoryId/feed', {
					templateUrl: 'app/FeedList/FeedList.html',
					controller: 'Reader.FeedList.Controller'
				})
				.when('/category/:categoryId/entry', {
					templateUrl: 'app/EntryList/EntryList.html',
					controller: 'Reader.EntryList.Controller'
				})
				.when('/category/:categoryId/entry/image-scroller', {
					templateUrl: 'app/ImageScrollerView/ImageScrollerView.html',
					controller: 'Reader.ImageScrollerView.Controller'
				})
				.when('/category/:categoryId/entry/random', {
					templateUrl: 'app/EntryList/EntryList.html',
					controller: 'Reader.EntryList.Controller'
				})
				.when('/feed/:feedId/entry', {
					templateUrl: 'app/EntryList/EntryList.html',
					controller: 'Reader.EntryList.Controller'
				})
				.when('/entry/:entryId', {
					templateUrl: 'app/EntryView/EntryView.html',
					controller: 'Reader.EntryView.Controller'
				})
				.otherwise({
					redirectTo: '/'
				});

			$locationProvider.html5Mode(true);

			$httpProvider.interceptors.push('AuthInterceptor');

			hotkeysProvider.useNgRoute = false;
		});

	/*
	 $this->router->get('/api/category', '\\Reader\\Controller\\Category:main');
	 $this->router->get('/api/category/:categoryId/feed', '\\Reader\\Controller\\Category:listFeed');
	 $this->router->get('/api/category/:categoryId/entry', '\\Reader\\Controller\\Category:listEntry');
	 $this->router->get('/api/category/:categoryId/entry/random', '\\Reader\\Controller\\Category:listEntryRandom');
	 $this->router->get('/api/feed/:feedId/entry', '\\Reader\\Controller\\Entry:listFeed');
	 $this->router->get('/api/entry/:entryId', '\\Reader\\Controller\\Entry:get');
	 $this->router->post('/api/entry/:entryId/read', '\\Reader\\Controller\\Entry:setRead');
	 $this->router->post('/api/entry/:entryId/marked', '\\Reader\\Controller\\Entry:setMarked');
	 */

})(window.angular);
