(function (angular) {
	'use strict';

	angular.module('Reader.EntryList').controller('Reader.EntryList.Controller', function ($scope, $resource, $routeParams, $location, hotkeys, config, ListResult) {
		var Category;
		if ($routeParams.categoryId) {
			var suffix = ($location.path().indexOf('random') >= 0) ? '/random' : '';
			Category = $resource(config.apiUrl + '/category/:categoryId/entry' + suffix, {categoryId: $routeParams.categoryId});
		} else if ($routeParams.feedId) {
			Category = $resource(config.apiUrl + '/feed/:feedId/entry', {feedId: $routeParams.feedId});
		}
		$scope.entries = Category.query();

		$scope.action = {
			seek: function(index) {
				ListResult.seek(index);
			}
		};
		ListResult.declare($scope.entries);

		hotkeys.bindTo($scope).add({
			combo: 'p',
			description: 'Previous: Go back to main category listing',
			callback: function() {
				$location.url('/');
			}
		}).add({
			combo: 'n',
			description: 'Next: Go to first entry',
			callback: function() {
				$location.url('/entry/' + $scope.entries[0].entryId)
			}
		});
	});

})(window.angular);