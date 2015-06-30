(function (angular) {
	'use strict';

	angular.module('Reader.EntryList').controller('Reader.EntryList.Controller', function ($scope, $resource, $routeParams, $location, hotkeys, config, ListResult) {
		var Category;
		if ($routeParams.feedId) {
			Category = $resource(config.apiUrl + '/feed/:feedId/entry', {feedId: $routeParams.feedId});
			$scope.backButton = {
				url: '/category/' + $routeParams.categoryId + '/feed',
				title: ''
			};
			$resource(config.apiUrl + '/feed/:feedId', {feedId: $routeParams.feedId}).get({}, function(data) {
				$scope.pageTitle = data.title;
			});
			$resource(config.apiUrl + '/category/:categoryId', {categoryId: $routeParams.categoryId}).get({}, function(data) {
				$scope.backButton.title = data.title;
			});
		} else if ($routeParams.categoryId) {
			var suffix = ($location.path().indexOf('random') >= 0) ? '/random' : '';
			Category = $resource(config.apiUrl + '/category/:categoryId/entry' + suffix, {categoryId: $routeParams.categoryId});
			$scope.backButton = {
				url: '/',
				title: 'Home'
			};
			$resource(config.apiUrl + '/category/:categoryId', {categoryId: $routeParams.categoryId}).get({}, function(data) {
				$scope.pageTitle = data.title;
			});
		}
		$scope.entries = Category.query();

		$scope.showFeed = !$routeParams.feedId;
		$scope.categoryId = $routeParams.categoryId;
		$scope.feedId = $routeParams.feedId;

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
				$location.url($scope.backButton.url);
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
