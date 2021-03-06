(function (angular) {
	'use strict';

	angular.module('Reader.EntryView')
		.controller('Reader.EntryView.Controller', function ($scope, $resource, $routeParams, $location, $timeout, hotkeys, config, ListResult, FullscreenSlideshow) {
			var Entry = $resource(config.apiUrl + '/entry/:entryId', {entryId: $routeParams.entryId}, {
				read: {method: 'POST', url: config.apiUrl + '/entry/:entryId/read'},
				mark: {method: 'POST', url: config.apiUrl + '/entry/:entryId/marked'}
			});

			$scope.entry = Entry.get({}, function() {
				Entry.read({}, true, function() {
					$scope.entry.isRead = 1;
				});

				$resource(config.apiUrl + '/feed/:feedId', {feedId: $scope.entry.feedId}).get({}, function(data) {
					$scope.pageTitle = data.title;
				});
				$timeout(function() {
					$scope.$emit('entryLoaded', $scope.entry);
				});
				if (!ListResult.isEnd()) {
					Entry.get({entryId: ListResult.peek().entryId}, function(data) {
						window.jQuery(data.content).find('img').each(function() {
							new Image().src = window.jQuery(this).attr('src');
						});
					});
				}
			});

			if ($routeParams.feedId) {
				$scope.backButton = {
					url: '/feed/' + $routeParams.feedId + '/entry?categoryId=' + $routeParams.categoryId,
					title: ''
				};
				$resource(config.apiUrl + '/feed/:feedId', {feedId: $routeParams.feedId}).get({}, function(data) {
					$scope.backButton.title = data.title;
				});
			} else if ($routeParams.categoryId) {
				$scope.backButton = {
					url: '/category/' + $routeParams.categoryId + '/entry',
					title: ''
				};
				$resource(config.apiUrl + '/category/:categoryId', {categoryId: $routeParams.categoryId}).get({}, function(data) {
					$scope.backButton.title = data.title;
				});
			}

			$scope.action = {
				goPrevious: function () {
					if (ListResult.isBeginning()) {
						$location.url('/');
					} else {
						$location.url('/entry/' + ListResult.previous().entryId + '?categoryId=' + $routeParams.categoryId + '&feedId=' + ($routeParams.feedId||''));
					}
				},
				goNext: function () {
					if (ListResult.isEnd()) {
						$location.url('/');
					} else {
						$location.url('/entry/' + ListResult.next().entryId + '?categoryId=' + $routeParams.categoryId + '&feedId=' + ($routeParams.feedId||''));
					}
				},
				toggleMarked: function() {
					Entry.mark({}, !$scope.entry.isMarked, function() {
						$scope.entry.isMarked = !$scope.entry.isMarked * 1;
						$(window).trigger('resize.autoforward');
					});
				},
				toggleRead: function() {
					Entry.read({}, !$scope.entry.isRead, function() {
						$scope.entry.isRead = !$scope.entry.isRead * 1;
					});
				},
				showIntervalDelay: function() {
					FullscreenSlideshow.inputSlideDelay();
				},
				startFullscreenSlideshow: function() {
					FullscreenSlideshow.enableDisable();
					FullscreenSlideshow.pausePlay();
				}
			};

			FullscreenSlideshow.goNextEntry = function() { $scope.$apply($scope.action.goNext); };
			FullscreenSlideshow.goPreviousEntry = function() { $scope.$apply($scope.action.goPrevious); };

			hotkeys.bindTo($scope).add({
				combo: 'p',
				description: 'Previous: Go to previous entry or back to main page.',
				callback: function() {
					if (FullscreenSlideshow.isActive() && FullscreenSlideshow.hasPrevious()) {
						FullscreenSlideshow.goPrevious();
					} else {
						$scope.action.goPrevious();
					}
				}
			}).add({
				combo: 'n',
				description: 'Next: Go to next entry, next image (in slideshow), or back to main page.',
				callback: function() {
					if (FullscreenSlideshow.isActive() && FullscreenSlideshow.hasNext()) {
						FullscreenSlideshow.goNext();
					} else {
						$scope.action.goNext();
					}
				}
			}).add({
				combo: 'N',
				description: 'Next: Go to the next entry (always).',
				callback: function() {
					$scope.action.goNext();
				}
			}).add({
				combo: 'm',
				description: 'Move scroll to next image.',
				callback: function() {
					// FIXME
				}
			}).add({
				combo: 'f',
				description: 'Toggle full screen slideshow of images.',
				callback: function() {
					FullscreenSlideshow.enableDisable();
				}
			}).add({
				combo: 'd',
				description: 'View/Edit slideshow interval.',
				callback: function() {
					FullscreenSlideshow.inputSlideDelay();
				}
			}).add({
				combo: 'space',
				description: 'Toggle automatic slideshow advancement.',
				callback: function() {
					FullscreenSlideshow.pausePlay();
				}
			}).add({
				combo: 's',
				description: 'Toggle mark on current entry.',
				callback: function() {
					$scope.action.toggleMarked();
				}
			}).add({
				combo: 'u',
				description: 'Toggle unread on current entry.',
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
