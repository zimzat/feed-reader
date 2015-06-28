(function (angular) {
	'use strict';

	angular.module('Reader.Login').controller('Reader.Login.Controller', function ($scope, $location, hotkeys) {
		$location.url('/category');

		hotkeys.bindTo($scope).add({
			combo: 'enter',
			callback: function() {
				$scope.action.login($scope.credentials);
			},
			allowIn: ['INPUT']
		});

		$scope.credentials = {
			username: '',
			password: ''
		};

		$scope.action = {
			login: function(credentials) {
				console.log(credentials);
			}
		};
	});

})(window.angular);
