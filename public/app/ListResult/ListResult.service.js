(function (angular) {
	'use strict';

	angular.module('Reader.ListResult').service('ListResult', function () {
		var results = [],
			current = 0,
			operations = {
				declare: function (input) {
					results = input;
				},
				seek: function(index) {
					if (index >= 0 && index < results.length) {
						current = index;
					}
				},
				current: function () {
					if (results.length > 0) {
						return results[current];
					}
				},
				next: function () {
					if (!operations.isEnd()) {
						return results[++current];
					}
				},
				previous: function () {
					if (!operations.isBeginning()) {
						return results[--current];
					}
				},
				isEnd: function () {
					return current >= results.length;
				},
				isBeginning: function () {
					return current === 0;
				}
			};

		return operations;
	});

})(window.angular);
