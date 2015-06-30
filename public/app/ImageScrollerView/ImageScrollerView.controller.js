(function(angular) {
    'use strict';

	angular.module('Reader.ImageScrollerView').controller('Reader.ImageScrollerView.Controller', function($scope, $resource, $location, $routeParams, hotkeys, config) {
		var Category = $resource(config.apiUrl + '/category/:categoryId/entry', {categoryId: $routeParams.categoryId});
		$scope.entries = [];
//		$scope.entries = [
//			{
//				entryId: 1,
//				isMarked: false,
//				images: [
//					{src: 'http://36.media.tumblr.com/e581da0f7edd150bfc50481392bf2248/tumblr_ngp4xsOWcE1s5krkfo1_500.jpg'},
//					{src: 'http://40.media.tumblr.com/aab79d5a2e9c67e1ca72ea519f55a14d/tumblr_ngp4xsOWcE1s5krkfo2_500.jpg'}
//				]
//			},
//			{
//				entryId: 2,
//				isMarked: false,
//				images: [
//					{src: 'http://41.media.tumblr.com/2926fd3df1e09b03a20fce4f4f0a5638/tumblr_nq9qfo6a6p1rmuqa7o1_500.jpg'},
//					{src: 'http://40.media.tumblr.com/880ef165bac17e57a6780215bcf95b29/tumblr_nq9qfo6a6p1rmuqa7o2_500.jpg'}
//				]
//			},
//			{
//				entryId: 3,
//				isMarked: true,
//				images: [
//					{src: 'http://36.media.tumblr.com/8234246fe7aacac9946163b41b8bcca4/tumblr_nq7njjDEL41r1h7qao1_500.jpg'}
//				]
//			},
//			{
//				entryId: 4,
//				isMarked: true,
//				images: [
//					{src: 'http://40.media.tumblr.com/9c36a3feb808d863c76c2980611880bd/tumblr_niszyd18tL1qcxa34o1_500.jpg'}
//				]
//			}
//		];

		(function($) {
			$(window)
				.on('mousewheel wheel', function (e) {
					document.getElementById('grid-layout').scrollLeft += Math.min(200, window.innerWidth / 6) * ((e.wheelDelta || -e.deltaY) > 0 ? -1 : 1);
				});
		})(angular.element);

		var hoverEntry = null;
		var Entry = $resource(config.apiUrl + '/entry/:entryId', {}, {
			read: {method: 'POST', url: config.apiUrl + '/entry/:entryId/read'},
			mark: {method: 'POST', url: config.apiUrl + '/entry/:entryId/marked'}
		});

		$scope.action = {
			markAllRead: function() {},
			markEntry: function(entry) {
				Entry.mark({entryId: entry.entryId}, !entry.isMarked, function() {
					entry.isMarked = !entry.isMarked * 1;
				});
			},
			markHoverEntry: function() {
				if (hoverEntry) {
					$scope.action.markEntry(hoverEntry);
				}
			},
			setHoverEntry: function(entry) {
				console.log(entry.entryId);
				hoverEntry = entry;
			},
			clearHoverEntry: function() {
				hoverEntry = null;
			}
		}

		hotkeys.bindTo($scope).add({
			combo: 'p',
			description: 'Previous: Go back to main category listing',
			callback: function() {
				$location.url('/');
			}
		}).add({
			combo: 'n',
			description: 'Next: Load More (if available)',
			callback: function() {
				Category.query({}, function(data) {
					$scope.entries = $scope.entries.concat(data);
				});
			}
		}).add({
			combo: 'm',
			description: 'Scroll to the next image',
			callback: function() {

			}
		}).add({
			combo: ',',
			description: 'Mark the entry currently under the mouse.',
			callback: function() {
				$scope.action.markHoverEntry();
			}
		}).add({
			combo: 'R',
			description: 'Mark all entries read',
			callback: function() {
				$scope.action.markAllRead();
			}
		}).add({
			combo: 'home',
			description: 'Scroll to the beginning',
			callback: function() {
				document.getElementById('grid-layout').scrollLeft = 0;
			}
		}).add({
			combo: 'end',
			description: 'Scroll to the end',
			callback: function() {
				document.getElementById('grid-layout').scrollLeft = document.getElementById('grid-layout').scrollWidth;
			}
		});
	});

})(window.angular);
