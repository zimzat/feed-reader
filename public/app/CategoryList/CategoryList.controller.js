(function(angular) {
    'use strict';

	angular.module('Reader.CategoryList').controller('Reader.CategoryList.Controller', function($scope, $resource, $location, $timeout, favicon, hotkeys, config) {
		var Category = $resource(config.apiUrl + '/category'),
			updateFunction = function() {
				Category.get({}, function(data) {
					$scope.summary = data;
					favicon.badge(data.recent);
					updatePromise = $timeout(updateFunction, 300000, false);
				});
			},
			updatePromise;

		updateFunction();
		$scope.$on('$destroy', function() {
			$timeout.cancel(updatePromise);
		});

		$scope.action = {
			logout: function() {
				$resource(config.apiUrl + '/authentication/logout').save();
				delete localStorage.authToken;
				$location.url('/login');
			}
		};

		hotkeys.bindTo($scope).add({
			combo: 'p',
			description: 'Previous: Go back to main category listing',
			callback: function() {
				$location.url('/');
			}
		}).add({
			combo: 'n',
			description: 'Next: Go to first feed',
			callback: function() {
				if ($scope.summary.recent) {
					$location.url('/category/0/entry');
				} else {
					$location.url('/category/' + $scope.summary.categories[0].categoryId + '/feed');
				}
			}
		});
	});

})(window.angular);
