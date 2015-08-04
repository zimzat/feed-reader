(function (angular) {
	'use strict';

	angular.module('Reader.Login').controller('Reader.Login.Controller', function ($scope, $location, $resource, hotkeys, favicon, config) {
		$scope.credentials = {
			username: '',
			password: ''
		};

		favicon.badge(0);

		hotkeys.bindTo($scope).add({
			combo: 'return',
			callback: function() {
				$scope.action.login($scope.credentials);
			},
			allowIn: ['INPUT']
		});

		$scope.action = {
			login: function(credentials) {
				if (credentials.username === '' || credentials.password === '') {
					return;
				}

				$resource(config.apiUrl + '/authentication/login').save({}, credentials).$promise.then(function() {
					$location.url('/');
				}, function() {
					$scope.loginError = 'Invalid credentials';
				});
			}
		};
	});

})(window.angular);
