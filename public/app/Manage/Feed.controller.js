(function(angular) {
	'use strict';

	angular.module('Reader.Manage').controller('Reader.Manage.Feed.Controller', function($scope, $resource, $location, config) {
		$scope.feed = {
			frequency: 0,
			url: $location.search().url,
			title: '',
			isEnabled: 1,
			categoryId: 0
		};

		$scope.categories = $resource(config.apiUrl + '/category/list').query();

		$scope.$watch('feed.frequency', function() {
			console.log($scope.feed);
			if ($scope.feed.frequency > 1440) {
				$scope.feed.frequency = ($scope.feed.frequency / 60 / 6).toFixed() * 60 * 6;
			}
		});

		$scope.feedFrequency = function() {
			var f = $scope.feed.frequency;
			if (!f || f === '0') {
				return '[30m]';
			} else if (f < 60) {
				return f + 'm';
			} else if (f < 1440) {
				return (f / 60) + 'h';
			} else {
				return (f / 60 / 24) + 'd';
			}
		};

		$scope.action = {
			save: function() {
				$resource(config.apiUrl + '/feed').save({}, $scope.feed, function() {
					$location.url('/manage');
				});
			}
		};
	});

})(window.angular);
