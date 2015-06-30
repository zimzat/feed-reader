(function (angular) {
	'use strict';

	angular.module('Reader.Login').controller('Reader.Login.Controller', function ($scope, $location, $resource, hotkeys) {
		$location.url('/category'); return;

		$scope.credentials = {
			username: '',
			password: ''
		};

		hotkeys.bindTo($scope).add({
			combo: 'enter',
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

				$resource(config.apiUrl + '/authentication/login').save({}, credentials, function() {
					console.log(arguments);
					$location.refresh();
				}, function() {
					console.log(arguments);
				});
			}
		};
	});

})(window.angular);
