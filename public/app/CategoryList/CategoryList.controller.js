(function(angular) {
    'use strict';

	angular.module('Reader.CategoryList').controller('Reader.CategoryList.Controller', function($scope, $resource, $location, hotkeys, config) {
		var Category = $resource(config.apiUrl + '/category');
		$scope.summary = Category.get();

		$scope.action = {
			logout: function() {
				$location.url('/');
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
