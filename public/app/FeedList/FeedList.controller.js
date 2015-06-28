(function (angular) {
	'use strict';

	angular.module('Reader.FeedList').controller('Reader.FeedList.Controller', function ($scope, $resource, $routeParams, $location, hotkeys, config) {
		var Category = $resource(config.apiUrl + '/category/:categoryId/feed', {categoryId: $routeParams.categoryId});
		$scope.feeds = Category.query();

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
				$location.url('/feed/' + $scope.feeds[0].feedId + '/entry')
			}
		});
	});

})(window.angular);
