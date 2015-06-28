(function (angular) {
	'use strict';

	angular.module('Reader.EntryView')
		.controller('Reader.EntryView.Controller', function ($scope, $resource, $routeParams, $location, hotkeys, config, ListResult) {
			var Entry = $resource(config.apiUrl + '/entry/:entryId', {entryId: $routeParams.entryId}, {
				read: {method: 'POST', url: config.apiUrl + '/entry/:entryId/read'},
				mark: {method: 'POST', url: config.apiUrl + '/entry/:entryId/marked'}
			});

			$scope.entry = Entry.get({}, function() {
				if (!$scope.entry.isRead) {
					$scope.action.toggleRead();
				}
			});

			$scope.action = {
				goPrevious: function () {
					if (ListResult.isBeginning()) {
						$location.url('/');
					} else {
						$location.url('/entry/' + ListResult.previous().entryId);
					}
				},
				goNext: function () {
					if (ListResult.isEnd()) {
						$location.url('/');
					} else {
						$location.url('/entry/' + ListResult.next().entryId);
					}
				},
				toggleMarked: function() {
					Entry.mark({}, !$scope.entry.isMarked, function() {
						$scope.entry.isMarked = !$scope.entry.isMarked * 1;
					});
				},
				toggleRead: function() {
					Entry.read({}, !$scope.entry.isRead, function() {
						$scope.entry.isRead = !$scope.entry.isRead * 1;
					});
				}
			};

			hotkeys.bindTo($scope).add({
				combo: 'p',
				description: 'Previous: Go to previous entry or back to main page.',
				callback: function() {
					$scope.action.goPrevious();
				}
			}).add({
				combo: 'n',
				description: 'Next: Go to next entry or back to main page.',
				callback: function() {
					$scope.action.goNext();
				}
			}).add({
				combo: 'm',
				description: 'Move scroll to next image.',
				callback: function() {

				}
			}).add({
				combo: 's',
				description: 'Toggle mark on current entry.',
				callback: function() {
					$scope.action.toggleMarked();
				}
			}).add({
				combo: 'r',
				description: 'Toggle read on current entry.',
				callback: function() {
					$scope.action.toggleRead();
				}
			});
		})
		.filter("sanitize", function ($sce) {
			return function (htmlCode) {
				return $sce.trustAsHtml(htmlCode);
			};
		});

})(window.angular);
